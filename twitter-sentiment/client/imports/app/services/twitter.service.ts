import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

import { Observable, of, Observer, BehaviorSubject, bindCallback, observable } from 'rxjs';
import { catchError, flatMap, map, delay } from 'rxjs/operators';
import { MeteorObservable, MongoObservable } from 'meteor-rxjs';

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
		// TODO: use bahavior subject so it doesn't return in memory documents immediately
		this.searchResults$ = Observable.create((observer: Observer<Tweet[]>) => {
			// TODO: disable autopublish and move finding documents by userId to server-side
			this.searchResultsHandle = this.searchResults.find({ userId: Meteor.userId() }).observeChanges({
				added: (id, fields) => {
					console.log('doc changed', id)
					const tweets = JSON.parse(fields['tweets']);
					observer.next(tweets);
				}
			});
		});

		Accounts.onPageLoadLogin(() => {
			this.auth$.next(Meteor.user());
		});
	}

	search(q: string): Observable<Tweet[]> {
		return MeteorObservable.call('search', q)
			.pipe(
				flatMap((val) => {
					return this.searchResults$;
				}),
				catchError(this.handleError<any>('search'))
			);
		// const tweets = JSON.parse(this.searchResults.findOne({ userId: Meteor.userId() })['tweets']);
		// return of(tweets);
	}

	loginWithTwitter(): Observable<Meteor.User> {
		return  new Observable((subscriber) => {
			Meteor.loginWithTwitter({}, (err) => {
				if (err) {
					// TODO: prevent the user from interacting with the site.
					subscriber.error('Failed to log in with Twitter: ' + err);
				} else {
					subscriber.next(Meteor.user());
					this.auth$.next(Meteor.user());
					subscriber.complete();
				}
			})
		})
		.pipe(
			catchError(this.handleError<any>('search'))
		);
	}

	logout(): Observable<Meteor.User> {
		return new Observable((subscriber) => {
			Meteor.logout((err) => {
				if (err) {
					subscriber.error('Failed to logout: ' + err);
				} else {
					subscriber.next(Meteor.user());
					this.auth$.next(Meteor.user());
					subscriber.complete();
				}
			});
		})
		.pipe(
			catchError(this.handleError<any>('search'))
		);
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.log(error); // log to console instead

			// TODO: add a logging service that displays errors to the user
			// this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
};

export interface Tweet {
	created_at: string;
	full_text: string;
	retweet_count: number;
	favorite_count: number;
	id_str: string;
	user: {
		name: string;
		screen_name: string;
		profile_image_url_https: string;
	}
}
