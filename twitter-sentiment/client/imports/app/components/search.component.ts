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
	providers: [],
	animations: [
		trigger('search', [
			state('in', style({
				transform: 'translateY(0)',
				opacity: 1
			})),
			// TODO: router animations: https://angularfirebase.com/snippets/router-transition-animations-with-angular-4/
			transition(':leave', [
				animate('400ms ease-out', style({
					transform: 'translateY(-100%)',
					opacity: 0
				}))
			]),
			transition(':enter', [
				style({
					transform: 'translateY(-100%)',
					opacity: 0
				}),
				animate('400ms ease-out')
			])
		])
	]
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

