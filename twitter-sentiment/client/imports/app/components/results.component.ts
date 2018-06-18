import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { GoogleService } from '../services/google.service';
import { TwitterService, Tweet} from '../services/twitter.service';

import { Subscription } from 'rxjs';

@Component({
	selector: 'my-app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss'],
	providers: [],
	animations: [
		trigger('search', [
			state('in', style({
				transform: 'translateY(0)',
				opacity: 1
			})),
			transition(':enter', [
				style({
					transform: 'translateY(100%)',
					opacity: 0
				}),
				animate('400ms ease-out')
			]),
			transition(':leave', [
				animate('400ms ease-out', style({
					transform: 'translateY(100%)',
					opacity: 0
				}))
			])
		])
	]
})
export class ResultsComponent implements OnInit, OnDestroy {
	
	searchResults: Tweet[] = [];

	routeDataSubscription: Subscription;

	constructor(private twitterService: TwitterService, private route: ActivatedRoute) {}

	ngOnInit() {
		this.routeDataSubscription = this.route.data.subscribe(
			(data: { results: Tweet[] }) => {
				console.log(data);
				this.searchResults = data.results;
			}
		)
	}

	ngOnDestroy() {
		console.log('destoyed')
		this.routeDataSubscription.unsubscribe();
	}

}
