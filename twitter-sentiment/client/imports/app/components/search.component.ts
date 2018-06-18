import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { GoogleService } from '../services/google.service';
import { TwitterService, Tweet} from '../services/twitter.service';

import { Subscription } from 'rxjs';

@Component({
	selector: 'my-app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	providers: []
})
export class SearchComponent implements OnInit {
	searchStr = '';

	loggingIn = false;
	// TODO: Prevent user interaction when logging in
	user: Meteor.User;

	authSubscription: Subscription;

	constructor(private twitterService: TwitterService, private changeDetector: ChangeDetectorRef, private router: Router) {}

	ngOnInit() {
		this.authSubscription = this.twitterService.auth$.subscribe(
			user => {
				this.user = user;
				this.changeDetector.detectChanges();
			}
		);
	}

	ngOnDestroy() {
		this.authSubscription.unsubscribe();
	}

	search() {
		this.router.navigate(['search'], { queryParams: { q: this.searchStr } });
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

