import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TwitterService } from './services/twitter.service';

declare const twttr;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit {
	searchStr = '';
	searching = false;
	loggingIn = false;
	// TODO: Prevent user interaction when logging in
	user: Meteor.User;

	constructor(private twitterService: TwitterService, private changeDetector: ChangeDetectorRef) {}

	ngOnInit() {
		this.twitterService.auth$.subscribe(
			user => {
				this.user = user;
			}
		)
	}

	search() {
		this.searching = true;
		this.twitterService.search(this.searchStr).subscribe(
			res => {
				console.log(res);
			},
			() => {
				this.searching = false;
				this.changeDetector.detectChanges();
			}
		)
	}

	loginWithTwitter() {
		this.loggingIn = true;
		this.twitterService.loginWithTwitter().subscribe(
			user => {
				console.log('authenticated:' + user);
			},
			err => { console.log(err) },
			() => { this.loggingIn = false; this.changeDetector.detectChanges(); }
		)
	}

	logout() {
		this.loggingIn = true;
		this.twitterService.logout().subscribe(
			user => {
				console.log('logged out: ' + user);
			},
			err => { console.log(err) },
			() => { this.loggingIn = false; this.changeDetector.detectChanges(); }
		)
	}
}
