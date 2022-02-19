import {Injectable, SkipSelf} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient) {

  }

  public getArtistById(id: string) {
    return this.httpClient.get<any>("http://localhost:8888/info/artist/" + id);
  }

  public getPlaylistById(id: string) {
    return this.httpClient.get<any>("http://localhost:8888/playlist/" + id);
  }
  public getSongById(id: string) {
    return this.httpClient.get<any>("http://localhost:8888/info/song/" + id);
  }
  public getAlbumById(id: string) {
    return this.httpClient.get<any>("http://localhost:8888/info/album/" + id);
  }

  public getUserLikedTracksPlaylist() {
    return this.httpClient.get<any>("http://localhost:8888/me/playlists/liked/")
  }

  public getConnectedDevices() {
    return this.httpClient.get<any>("http://localhost:8888/api/v3/devices/");
  }

  public getPlayerStateOnConnect() {
    return this.httpClient.get<any>("http://localhost:8888/api/v3/state/player")
  }
}
