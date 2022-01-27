import { Injectable } from '@angular/core';
import {AudioPlayerService} from "../../audio-player/AudioPlayerService";
import {Queue} from "../Queue";

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private queue: Queue = new Queue();
  constructor(private audioPlayerService:AudioPlayerService) { }


  getQueue(): Queue  {
    return this.audioPlayerService.getSongQueue();
  }
}
