import { Component } from '@angular/core';
import { TwitterService } from './services/twitter.service';

declare const twttr;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	searchStr = '';
	searching = false;

	constructor(private twitterService: TwitterService) {}

	search() {
		this.searching = true;
		this.twitterService.search(this.searchStr).subscribe(
			res => {console.log(res)},
			err => {console.log(err)},
			() => {
				this.searching = false;
			}
		)
	}
}
