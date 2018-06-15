import { HTTP } from 'meteor/http';
import { bindCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

	search(q: string): Observable<any> {
		const url = `${this.apiUrl}/search/tweets.json?q=${q}`;
		return bindCallback(<(url, params, callback) => {}>this.oauth1.get).call(this.oauth1, url, {})
		.pipe(
			map((results) => {
				// The first argument passed into the callback of Meteor.call is an error object.
				let errorObj: any = results[0];
				if (errorObj) {
					throw new Error(errorObj);
				}
				return results[1];
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
