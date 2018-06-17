import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

import { Observable, of, Observer, BehaviorSubject, bindCallback, observable } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class GoogleService {

	sentimentResults = new Mongo.Collection('sentiment-results');

	sentimentResultsHandle: Meteor.LiveQueryHandle;
	sentimentResults$Array: Observable<any>[] = [];

	constructor(private http: HttpClient) {
		
	}

	analyzeSentiment(q: string, tweetId: string): Observable<SentimentResults> {
		// return Meteor.call('analyze', q, tweetId)
		// 	.pipe(
		// 		catchError(this.handleError<any>('analyze')),
		// 		flatMap((val) => {
		// 			const sentimentResults$ = Observable.create((observer: Observer<any>) => {
		// 				this.sentimentResultsHandle = this.sentimentResults.find({ tweetId }).observe({
		// 					added: (doc) => {
		// 						observer.next(doc);
		// 					}
		// 				});
		// 			})
		// 			this.sentimentResults$Array.push(sentimentResults$);
		// 			return sentimentResults$;
		// 		})
		// 	)
		return <any>of(this.sentimentResults.findOne({ tweetId }));
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
}

export interface SentimentResults {
	score: number;
	magnitude: number;
}
