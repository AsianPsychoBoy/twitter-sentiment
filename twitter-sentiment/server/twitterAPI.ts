import { HTTP } from 'meteor/http';
import { bindCallback, Observable, of } from 'rxjs';
import { map, switchMap, delay } from 'rxjs/operators';

export class Twitter {
	apiUrl = 'https://api.twitter.com/1.1';
	oauth1;

	constructor(options: TwitterOptions) {
		// Here I used the oauth1 package's tools for making an oauth call.
		this.oauth1 = new (Package['oauth1'].OAuth1Binding)({
			consumerKey: options.consumerKey,
			secret: options.consumerSecret
		});
		this.oauth1.accessToken = options.accessToken;
		this.oauth1.accessTokenSecret = options.accessTokenSecret;
	}

	search(q: string, minCount: number, nextResults?: string, tweetsToReturn?: any[]): Observable<any> {
		//TODO: this only searches the most recent 1500 tweets, to get more I have to use MaxID
		let url = `${this.apiUrl}/search/tweets.json`;

		if (nextResults) {
			url += nextResults;
		}

		const options = {
			q,
			result_type: 'mixed',
			lang: 'en',
			count: 100,
			tweet_mode: 'extended',
		}

		return bindCallback(<(url, params, callback) => {}>this.oauth1.get).call(this.oauth1, url, options)
		.pipe(
			switchMap((results) => {
				const errorObj: any = results[0];

				if (errorObj) {
					throw new Error(errorObj);
				}

				if (!tweetsToReturn) {
					tweetsToReturn = [];
				}

				const data = results[1].data;
				console.log(tweetsToReturn.length);
				tweetsToReturn = tweetsToReturn.concat(data.statuses);

				if (tweetsToReturn.length < minCount) {
					return this.search(q, minCount, data.search_metadata.next_results, tweetsToReturn)
				} else {
					return of(tweetsToReturn);
				}
			})
		);
	}
}

export interface TwitterOptions {
	consumerKey: string;
	consumerSecret: string;
	accessToken: string;
	accessTokenSecret: string;
}
