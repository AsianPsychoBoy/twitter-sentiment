import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition, group } from '@angular/animations';

import { TwitterService, Tweet} from './services/twitter.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
  animations: []
})
export class AppComponent {
}
