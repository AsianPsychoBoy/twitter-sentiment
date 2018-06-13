import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	// code to run on server at startup
	ServiceConfiguration.configurations.upsert(
		{ service: 'twitter' },
		{
			$set: {
			loginStyle: 'popup',
			consumerkey: Meteor.settings.twitter.consumerKey, // See table below for correct property name!
			secret: Meteor.settings.twitter.consumerSecret
			}
		}
	);
	
	
	Meteor.methods({
		authenticateTwitter() {
			// Meteor.loginWithTwitter()
		}
	});
});
