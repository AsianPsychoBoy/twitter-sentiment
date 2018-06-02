import 'zone.js';
import 'core-js/es7/reflect';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
 
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule
	  ],
	  providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
