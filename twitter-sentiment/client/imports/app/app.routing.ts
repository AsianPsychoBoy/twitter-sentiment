import { RouterModule, Routes } from '@angular/router';

import { ResultsComponent } from './components/results.component';
import { SearchComponent } from './components/search.component';

import { AuthGuard } from './services/auth-guard.service';

export const appRoutes: Routes = [
	{
		path: '',
		component: SearchComponent
	},
	{
		path: 'search',
		component: ResultsComponent,
		canActivate: [AuthGuard]
	}
]
