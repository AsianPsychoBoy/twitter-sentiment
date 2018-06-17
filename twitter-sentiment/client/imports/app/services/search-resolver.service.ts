import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
 
import { Tweet, TwitterService }  from './twitter.service';
import { Twitter } from 'server/twitterAPI';
 
@Injectable()
export class SearchResolver implements Resolve<Tweet[]> {
	constructor(private twitterService: TwitterService, private router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tweet[]> {
		console.log('search');
		const searchStr = route.queryParamMap.get('q');
		return this.twitterService.search(searchStr).pipe(
			take(1),
			map(tweets => {
				if (tweets) {
					return tweets;
				} else {
					this.router.navigate(['']);
					return null;
				}
			})
		)
	}
}
