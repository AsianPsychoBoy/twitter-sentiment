import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
 
import { Crisis, CrisisService }  from './crisis.service';
 
@Injectable()
export class CrisisDetailResolver implements Resolve<Crisis> {
	constructor(private cs: CrisisService, private router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> {
	}
}
