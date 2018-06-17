import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Mongo } from 'meteor/mongo';

import { Observable, of, Observer, BehaviorSubject, bindCallback, observable } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class TwitterService {

	auth$ = new BehaviorSubject<Meteor.User>(Meteor.user());
	searchResults = new Mongo.Collection('search-results');

	searchResultsHandle: Meteor.LiveQueryHandle;
	searchResults$: Observable<Tweet[]>;

	constructor(private http: HttpClient) {
		this.searchResults$ = Observable.create((observer: Observer<Tweet[]>) => {
			// TODO: disable autopublish and move finding documents by userId to server-side
			this.searchResultsHandle = this.searchResults.find({ userId: Meteor.userId() }).observe({
				added: (doc) => {
					const tweets = JSON.parse(doc['tweets']);
					observer.next(tweets);
				}
			});
		});
	}

	search(q: string): Observable<Tweet[]> {
		// return Meteor.call('search', q)
		// 	.pipe(
		// 		catchError(this.handleError<any>('search')),
		// 		flatMap((val) => {
		// 			return this.searchResults$;
		// 		})
		// 	);
		const tweets = JSON.parse(this.searchResults.findOne({ userId: Meteor.userId() })['tweets']);
		return of(tweets);
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
	created_at: string;
	text: string;
	retweet_count: number;
	favorite_count: number;
	user: {
		name: string;
		screen_name: string;
		profile_image_url_https: string;
	}
}
