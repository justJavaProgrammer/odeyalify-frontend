import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { HomepageComponent } from './homepage/homepage.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BasicAuthHttpInterceptorService} from "./login-page/service/basic-auth-http-interceptor.service";
import { NotFoundComponent } from './not-found/not-found.component';
import {LoginPageComponent} from "./login-page/login-page.component";
import { SearchComponent } from './search/search.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: '**', component: NotFoundComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomepageComponent,
    NotFoundComponent,
    SearchComponent,
    NavigationComponent,
    AudioPlayerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthHttpInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
