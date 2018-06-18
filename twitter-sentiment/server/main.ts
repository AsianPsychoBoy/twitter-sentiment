import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Accounts } from 'meteor/accounts-base'
import { Twitter } from './twitterAPI';
import { NaturalLanguage } from './googleAPI';
import { writeFileSync } from 'fs';

const searchResults= new Mongo.Collection('search-results');
const sentimentResults = new Mongo.Collection('sentiment-results');

Meteor.startup(() => {
	if (!Meteor.settings.twitter) {
		throw new Meteor.Error('Please create a config.js file.');
	}
	// code to run on server at startup
	ServiceConfiguration.configurations.upsert(
		{ service: 'twitter' },
		{
			$set: {
				loginStyle: 'popup',
				consumerKey: Meteor.settings.twitter.consumerKey,
				secret: Meteor.settings.twitter.consumerSecret
			}
		}
	);

	let twitter: Twitter = null;
	let naturalLanguage: NaturalLanguage = null;

	Accounts.onLogin((details) => {
		twitter = new Twitter({
			consumerKey: Meteor.settings.twitter.consumerKey,
			consumerSecret: Meteor.settings.twitter.consumerSecret,
			accessToken: details.user.services.twitter.accessToken,
			accessTokenSecret: details.user.services.twitter.accessTokenSecret
		});

		naturalLanguage = new NaturalLanguage(Meteor.settings.google);
	})

	Meteor.methods({
		search(q: string) {
			if (!twitter) {
				throw new Meteor.Error('You are not logged in.');	
			}
			if (!q) {
				throw new Meteor.Error('You must enter a query.');	
			}
			twitter.search(q).subscribe(
				res => {
					const tweets = res.data.statuses;
					console.log(res.data);

					// TODO: enable this after testing
					searchResults.remove({
						userId: Meteor.userId()
					});

					sentimentResults.remove({
						userId: Meteor.userId()
					});

					searchResults.upsert(
						{
							userId: Meteor.userId()
						},
						{
							userId: Meteor.userId(),
							tweets: JSON.stringify(tweets)
						}
					);
				},
				err => { console.error(err) }
			);
		},
		async analyze(q: string, tweetId: string) {
			// use analyze entity sentiment for more accuracy
			const results = await naturalLanguage.analyzeSentiment(q);

			console.log(results);
			const sentiment = results[0].documentSentiment;
			const sentences = results[0].sentences;

			sentimentResults.upsert(
				{ tweetId },
				{
					userId: Meteor.userId(),
					tweetId,
					score: sentiment.score,
					magnitude: sentiment.magnitude
				}
			)
		}
	});
});
