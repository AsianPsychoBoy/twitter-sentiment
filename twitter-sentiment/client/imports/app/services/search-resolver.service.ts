import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, catchError, timeout } from 'rxjs/operators';
 
import { Tweet, TwitterService }  from './twitter.service';
import { Twitter } from 'server/twitterAPI';
 
@Injectable()
export class SearchResolver implements Resolve<Tweet[]> {
	constructor(private twitterService: TwitterService, private router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tweet[]> {
		const searchStr = route.queryParamMap.get('q');
		return this.twitterService.search(searchStr).pipe(
			take(1),
			timeout(10000),
			map(tweets => {
				console.log('resolved:', tweets)
				if (tweets) {
					return tweets;
				} else {
					this.router.navigate(['']);
					return null;
				}
			}),
			catchError((err) => {
				console.log('tiemout');
				this.router.navigate(['']);
				return of(null);
			})
		)
	}
}
