import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <app-navigation *ngIf="!showNavAndFooter()"></app-navigation>
      <router-outlet></router-outlet>
      <app-audio-player *ngIf="!showNavAndFooter()" #audioPlayerComponent></app-audio-player>
    </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotify-fronted';

  constructor(private router: Location) {
  }

  showNavAndFooter(): boolean {
    let url = this.router.path();
    return url == '/login' || url == '/signup' || url.includes('/partners/artist');
  }
}
