import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, Observer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class TwitterService {

	apiUrl: 'https://api.twitter.com/1.1';

	constructor(private http: HttpClient) {	}

	search(q: string): Observable<Tweet> {
		const url = `${this.apiUrl}/search/tweets.json?q=${q}`;
		return this.http.get<Tweet>(url)
			.pipe(
				tap(res => console.log('fetching tweets...')),
				catchError(this.handleError<any>('search'))
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
				}
			})
		});
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
