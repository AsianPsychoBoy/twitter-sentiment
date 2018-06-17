import 'zone.js';
import 'core-js/es7/reflect';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TweetComponent } from './components/tweet.component';
import { SearchComponent } from './components/search.component';
import { ResultsComponent } from './components/results.component';

import { GoogleService } from './services/google.service';
import { TwitterService } from './services/twitter.service';
import { AuthGuard } from './services/auth-guard.service';
import { SearchResolver } from './services/search-resolver.service'

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

import { appRoutes } from './app.routing';
 
@NgModule({
	declarations: [
		AppComponent,
		TweetComponent,
		SearchComponent,
		ResultsComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		MatInputModule,
		MatFormFieldModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		FormsModule,
		MatListModule,
		MatChipsModule,
		RouterModule.forRoot(
			appRoutes,
			{
				enableTracing: true
			}
		)
	  ],
	  providers: [
		  GoogleService,
		  TwitterService,
		  AuthGuard,
		  SearchResolver
	  ],
	bootstrap: [AppComponent]
})
export class AppModule {}
