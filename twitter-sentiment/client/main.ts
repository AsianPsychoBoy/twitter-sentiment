import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Meteor } from 'meteor/meteor';
import { AppModule } from './imports/app/app.module';
import { bindCallback, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

Meteor.startup(() => {
	platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
});
