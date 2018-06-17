import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { TwitterService, Tweet} from './services/twitter.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
  animations: [
		trigger('display-results.searchbar', [
			state('out', style({
				transform: 'translateY(-50%)',
			})),
			state('in', style({
				transform: 'translateY(0)',
			})),
			transition('in <=> out', animate('400ms ease-out'))
		]),
		trigger('display-results.results', [
			state('out', style({
				transform: 'translateY(100%)',
				opacity: 0,
				display: 'none'
			})),
			state('in', style({
				transform: 'translateY(0)',
				opacity: 1
			})),
			transition('in <=> out', animate('400ms ease-out'))
		])
	]
})
export class AppComponent implements OnInit {
	searchStr = '';
	searching = false;
	loggingIn = false;
	// TODO: Prevent user interaction when logging in
	user: Meteor.User;

	searchResults: Tweet[];
	displayResults = false;

	constructor(private twitterService: TwitterService, private changeDetector: ChangeDetectorRef, private r: Renderer2) {}

	ngOnInit() {
		this.twitterService.auth$.subscribe(
			user => {
				this.user = user;
				this.changeDetector.detectChanges();
			}
		);
	}

	search() {
		this.searching = true;
		this.twitterService.search(this.searchStr).subscribe(
			tweets => {
				console.log(tweets);
				this.searchResults = tweets;
				this.showResults();

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

	showResults() {
		if (this.searchResults) {
			this.displayResults = true;
		}
	}

	hideResults() {
		if (this.searchResults) {
			this.displayResults = false;
		}
	}
}
