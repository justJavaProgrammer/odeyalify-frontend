import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @Input('boss') bossName = 'Alex.jpeg'
  constructor(private service: HttpService) {
    this.service.getAlbumById('')
  }

  ngOnInit(): void {
  }

}
