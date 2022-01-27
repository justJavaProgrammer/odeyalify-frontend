import { Component, OnInit } from '@angular/core';
import {Queue} from "./Queue";
import {SongDto} from "../dto/SongDTO";

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

  }

  getSongQueue():SongDto[] {
    return Queue.queueSongs;
  }
}
