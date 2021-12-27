import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private service: HttpService) { }

  ngOnInit(): void {
  }

  test() {
    this.service.test().subscribe(value => {
      console.log(value.artistDto.artistId);
    });
  }
}
