import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Song} from "./Song";
import {AudioPlayerService} from "./AudioPlayerService";
import {ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";
import {SongDto} from "../dto/SongDTO";
import {Queue} from "../queue/Queue";

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  duration?: string;
  currentTime?: string;
  private playButton: any;
  private currentSongId: string = '';

  constructor(private audioPlayerService: AudioPlayerService) {
  }


  ngOnInit(): void {
    this.audioPlayerService.init();
    console.log("audio player is created")
  }

  ngAfterViewInit() {
    this.playButton = document.getElementById("play-button")
    this.duration = this.audioPlayerService.getDuration();
    this.currentTime = this.audioPlayerService.getCurrentTime();
  }

  resumeOrPause(): void {
    console.log(this.audioPlayerService.getIsPlaying())
    if (this.isPlaying()) {
      this.stopSong();
    } else {
      this.playButton!.className = '';
      this.resumePlaying();
    }
  }

  playSong(id: string) {
    this.audioPlayerService.playSong(id);
    this.currentSongId = id;
  }
  resumePlaying(): void {
    this.audioPlayerService.resumePlaying();
  }
  stopSong() {
    this.audioPlayerService.stopCurrentSong();
  }

  previousSong() {
    this.playButton!.className = 'fas fa-pause-circle';
    this.audioPlayerService.prevSong();
  }

  nextSong() {
    this.playButton!.className = 'fas fa-pause-circle';
    this.audioPlayerService.nextSong();
  }


  setDurationValue() {
    return this.audioPlayerService.getDuration()
  }

  setCurrentTime() {
    return this.audioPlayerService.getCurrentTime();
  }

  playAlbum(albumId:string) {
    this.audioPlayerService.playAlbum(albumId);
  }

  isPlaying():boolean {
    return this.audioPlayerService.getIsPlaying();
  }

  getSongCover(): string {
    return this.audioPlayerService.getCurrentTrack()?.songCoverImage!;
  }

  getArtistId(): string {
    return this.audioPlayerService.getCurrentTrack()?.artistResponseDTO.artistId!;
  }
  getArtistName(): string {
    return this.audioPlayerService.getCurrentTrack()?.artistResponseDTO.artistName!;
  }

  getTrackName(): string {
    return this.audioPlayerService.getCurrentTrack()?.songName!;
  }
}
