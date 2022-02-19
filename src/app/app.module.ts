import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BaseRouteReuseStrategy, RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HomepageComponent} from './homepage/homepage.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BasicAuthHttpInterceptorService} from "./login-page/service/basic-auth-http-interceptor.service";
import {NotFoundComponent} from './not-found/not-found.component';
import {LoginPageComponent} from "./login-page/login-page.component";
import {SearchComponent} from './search/search.component';
import {NavigationComponent} from './navigation/navigation.component';
import {AudioPlayerComponent} from './audio-player/audio-player.component';
import {RootComponent} from './root/root.component';
import {AudioPlayerRouteReuseStrategy} from "./support/AudioPlayerRouteReuseStrategy";
import {Test} from "./support/Test";
import {QueueComponent} from './queue/queue.component';
import {ArtistComponent} from './artist/artist.component';
import {UploadAlbumComponent} from './upload-album/upload-album.component';

const artistRoutes = [
  {path: 'upload', component: UploadAlbumComponent},
  {path: '', component: ArtistComponent, pathMatch: 'full'}
]
const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'search', component: SearchComponent},
  {path: 'search/:query', component: SearchComponent},
  {path: 'player', component: AudioPlayerComponent, canDeactivate: [Test]},
  {path: 'queue', component: QueueComponent},
  {
    path: 'partners/artist', children: [
      {path: '', component: ArtistComponent, pathMatch: 'full'},
      {path: 'upload', component: UploadAlbumComponent}
    ]
  },
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
    AudioPlayerComponent,
    RootComponent,
    QueueComponent,
    ArtistComponent,
    UploadAlbumComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthHttpInterceptorService, multi: true},
    // {provide: BaseRouteReuseStrategy, useClass: AudioPlayerRouteReuseStrategy}
    // {provide: Test}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
