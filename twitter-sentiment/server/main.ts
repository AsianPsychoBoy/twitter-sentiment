import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	// code to run on server at startup
	// ServiceConfiguration.configurations.upsert(
	// 	{ service: 'twitter' },
	// 	{
	// 		$set: {
	// 		loginStyle: "popup",
	// 		consumerkey: "1292962797", // See table below for correct property name!
	// 		secret: "75a730b58f5691de5522789070c319bc"
	// 		}
	// 	}
	// );
	
	
	Meteor.methods({
		authenticateTwitter() {
			// Meteor.loginWithTwitter()
		}
	});
});
