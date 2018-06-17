import 'zone.js';
import 'core-js/es7/reflect';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
 
@NgModule({
	declarations: [
		AppComponent
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
		MatListModule
	  ],
	  providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
