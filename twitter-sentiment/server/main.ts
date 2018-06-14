import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

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

	Meteor.methods({
		// 'loginWithTwitter'() {
		// 	Meteor.loginWithTwitter({}, (err) => {
		// 		if (err) throw new Meteor.Error('Error when logging in with twitter.');
		// 	});
		// }
	});
});
