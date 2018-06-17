import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { TwitterService, Tweet} from './services/twitter.service';

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

	searchResults: Tweet[];

	constructor(private twitterService: TwitterService, private changeDetector: ChangeDetectorRef, private r: Renderer2) {}

	ngOnInit() {
		this.twitterService.auth$.subscribe(
			user => {
				this.user = user;
			}
		);
	}

	search() {
		this.searching = true;
		this.twitterService.search(this.searchStr).subscribe(
			tweets => {
				console.log(tweets);
				this.searchResults = tweets;

				this.searching = false;
				this.changeDetector.detectChanges();
			},
			err => {}
		)
	}

	loginWithTwitter() {
		this.loggingIn = true;
		this.twitterService.loginWithTwitter().subscribe(
			user => {
				console.log('authenticated:' + user);
			},
			err => { },
			() => { this.loggingIn = false; this.changeDetector.detectChanges(); }
		)
	}

	logout() {
		this.loggingIn = true;
		this.twitterService.logout().subscribe(
			user => {
				console.log('logged out: ' + user);
			},
			err => { },
			() => { this.loggingIn = false; this.changeDetector.detectChanges(); }
		)
	}
}
