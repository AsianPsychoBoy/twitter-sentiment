import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router) {}

	canActivate() {
		const loggedIn = !!Meteor.user();
		// if (!loggedIn) {
		// 	this.router.navigate([''])
		// }
		console.log('checked auth');
		return loggedIn;
	}
}
