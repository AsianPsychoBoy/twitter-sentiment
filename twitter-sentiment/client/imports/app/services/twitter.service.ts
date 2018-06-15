import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, Observer, BehaviorSubject, bindCallback } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class TwitterService {

	auth$ = new BehaviorSubject<Meteor.User>(Meteor.user());

	constructor(private http: HttpClient) { }

	search(q: string): Observable<Tweet> {
		return Meteor.call('search', q)
			.pipe(
				catchError(this.handleError<any>('search')),
				flatMap((val) => {
					return bindCallback(<Function>Meteor.subscribe)('search-results')
				})
			);
	}

	loginWithTwitter(): Observable<Meteor.User> {
		return Observable.create((observer: Observer<Meteor.User>) => {
			Meteor.loginWithTwitter({}, (err) => {
				if (err) {
					// TODO: prevent the user from interacting with the site.
					observer.error('Failed to log in with Twitter: ' + err);
				} else {
					observer.next(Meteor.user());
					this.auth$.next(Meteor.user());
					observer.complete();
				}
			})
		})
		.pipe(
			catchError(this.handleError<any>('search'))
		);
	}

	logout(): Observable<Meteor.User> {
		return Observable.create((observer: Observer<Meteor.User>) => {
			Meteor.logout((err) => {
				if (err) {
					observer.error('Failed to logout: ' + err);
				} else {
					observer.next(Meteor.user());
					this.auth$.next(Meteor.user());
					observer.complete();
				}
			});
		})
		.pipe(
			catchError(this.handleError<any>('search'))
		);
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error); // log to console instead

			// TODO: add a logging service that displays errors to the user
			// this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
};

export interface Tweet {
	text: string
}
