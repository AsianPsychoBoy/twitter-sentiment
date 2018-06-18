import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { GoogleService, SentimentResults } from '../services/google.service';
import { Tweet} from '../services/twitter.service';

import { Subscription } from 'rxjs';

@Component({
	selector: 'my-app-tweet',
	templateUrl: './tweet.component.html',
	styleUrls: ['./tweet.component.scss'],
	providers: []
})
export class TweetComponent implements OnInit, OnDestroy {

	@Input() tweet: Tweet;

	sentiment: SentimentResults;

	sentimentSubscription: Subscription;

	constructor (private googleService: GoogleService, private changeDetector: ChangeDetectorRef) { }

	ngOnInit() {
		this.sentimentSubscription = this.googleService.analyzeSentiment(this.tweet.full_text, this.tweet.id_str).subscribe(
			results => {
				this.sentiment = results;
				this.changeDetector.detectChanges();
			}
		)
	}

	ngOnDestroy() {
		this.sentimentSubscription.unsubscribe();
	}

	sentimentText() {
		if (this.sentiment.magnitude > 1) {
			if (Math.abs(this.sentiment.score) < 0.15) {
				return { text: 'Mixed', color: SentimentColors.grey };
			} else if (this.sentiment.score > 0) {
				return { text: 'Very Positive', color: SentimentColors.green };
			} else {
				return { text: 'Very Negative', color: SentimentColors.red };
			}
		} else {
			if (Math.abs(this.sentiment.score) < 0.15) {
				return { text: 'Neutral', color: SentimentColors.yellow };
			} else if (this.sentiment.score > 0) {
				return { text: 'Positive', color: SentimentColors.green };
			} else {
				return { text: 'Negative', color: SentimentColors.red };
			}
		}
	}
}

const enum SentimentColors {
	red = '#e53935',
	yellow = '#fbc02d',
	green = '#43a047',
	grey = '#757575'
}
