import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `<div>
                    <router-outlet></router-outlet>
               </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotify-fronted';
}
