import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Accounts } from 'meteor/accounts-base'
import { Twitter } from './twitter';

Meteor.startup(() => {
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

	Accounts.onLogin((details) => {
		twitter = new Twitter({
			consumerKey: Meteor.settings.twitter.consumerKey,
			consumerSecret: Meteor.settings.twitter.consumerSecret,
			accessToken: details.user.services.twitter.accessToken,
			accessTokenSecret: details.user.services.twitter.accessTokenSecret
		});
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
					console.log(res);
					Meteor.publish('search-results', () => {
						return res;
					})
				},
				err => { console.error(err) }
			);
		}
	});
});
