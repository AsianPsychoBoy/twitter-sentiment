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

	searching = false;
	
	searchResults: Tweet[];

	constructor(private twitterService: TwitterService, private route: ActivatedRoute) {}

	ngOnInit() {
		this.search();
	}

	ngOnDestroy() {}

	search() {
		// TODO: use a resolve guard to improve UX
		this.searching = true;
		const searchStr = this.route.paramMap.subscribe(
			params => {
				console.log(params);
				const searchStr = params.get('q');
				this.twitterService.search(searchStr).subscribe(
					tweets => {
						console.log(tweets);
						this.searchResults = tweets;
		
						this.searching = false;
					},
					err => {}
				)
			}
		)
	}
}
