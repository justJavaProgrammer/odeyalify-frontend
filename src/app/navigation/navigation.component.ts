import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {

  }

  public getLikedTracksPlaylist() {
    this.httpService.getUserLikedTracksPlaylist().subscribe(value => {
      console.log(value)
    });
    //todo
  }

  public getUserPlaylist() {

  }
}
