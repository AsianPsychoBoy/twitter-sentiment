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
	providers: []
})
export class ResultsComponent implements OnInit, OnDestroy {
	
	searchResults: Tweet[];

	constructor(private twitterService: TwitterService, private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.data.subscribe(
			(data: { results: Tweet[] }) => {
				this.searchResults = data.results;
			}
		)
	}

	ngOnDestroy() {}

}
