import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

import { Observable, of, Observer, BehaviorSubject, bindCallback, observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MeteorObservable, MongoObservable } from 'meteor-rxjs';

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
		return MeteorObservable.call('analyze', q, tweetId)
			.pipe(
				switchMap((val) => {
					const sentimentResults$ = Observable.create((observer: Observer<any>) => {
						this.sentimentResultsHandle = this.sentimentResults.find({ tweetId }).observe({
							added: (doc) => {
								observer.next(doc);
								observer.complete();
							}
						});
					})
					this.sentimentResults$Array.push(sentimentResults$);
					return sentimentResults$;
				}),
				catchError(this.handleError<any>('analyze')),
			)
		// return <any>of(this.sentimentResults.findOne({ tweetId }));
	}

	sentimentStats(): SentimentStats {
		let results = {
			positive: 0,
			negative: 0,
			veryPositive: 0,
			veryNegative: 0,
			neutral: 0,
			mixed: 0
		}

		this.sentimentResults.find({ userId: Meteor.userId() }).forEach((doc: SentimentResults) => {
			if (doc.magnitude > 1) {
				if (Math.abs(doc.score) < 0.15) {
					results.mixed++;
				} else if (doc.score > 0) {
					results.veryPositive++;
				} else {
					results.veryNegative++;
				}
			} else {
				if (Math.abs(doc.score) < 0.15) {
					results.neutral++;
				} else if (doc.score > 0) {
					results.positive++;
				} else {
					results.negative++;
				}
			}
		});

		return results;
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
}

export interface SentimentResults {
	score: number;
	magnitude: number;
}

export interface SentimentStats {
	positive: number;
	negative: number;
	neutral: number;
}
