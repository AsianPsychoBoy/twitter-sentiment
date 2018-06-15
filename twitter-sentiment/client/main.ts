import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Meteor } from 'meteor/meteor';
import { AppModule } from './imports/app/app.module';
import { bindCallback, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

Meteor.startup(() => {
	platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
	const callerino = Meteor.call;
	Meteor.call = function(name: string, ...args: any[]): Observable<any> {
		let call = bindCallback(<Function>(callerino));
		return call(name, ...args)
			.pipe(
				map((results) => {
					// The first argument passed into the callback of Meteor.call is an error object.
					let errorObj: Meteor.Error = results[0];
					if (errorObj) {
						throw new Error(<string>errorObj.error);
					}
					return results[1];
				})
			);
	};

	// Meteor.call = bindCallback(<Function>(Meteor.call));
});
