import 'zone.js';
import 'core-js/es7/reflect';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { MatInputModule } from '@angular/material/input';
 
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		MatInputModule
	  ],
	  providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
