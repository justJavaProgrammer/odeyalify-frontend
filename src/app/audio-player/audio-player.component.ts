import {AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {Song} from "./Song";
import {AudioPlayerService} from "./AudioPlayerService";
import {ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";
import {SongDto} from "../dto/SongDTO";
import {Queue} from "../queue/Queue";
import {DOCUMENT} from "@angular/common";
import {AudioPlayerWebSocketSyncHandler} from "./sync/AudioPlayerWebSocketSyncHandler";
import {AudioPlayerStateDTO} from "./sync/AudioPlayerStateDTO";
import {Device} from "./sync/Device";
import {HttpService} from "../http.service";

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
  private fullScreenElement: any;
  private _clicked: boolean = false;
  private _connectedDevices: Device[] = [];
  devices: any;

  constructor(private audioPlayerService: AudioPlayerService,
              @Inject(DOCUMENT) private document: any, private httpClient: HttpService) {
  }


  ngOnInit(): void {
    this.audioPlayerService.init();
    this.fullScreenElement = document.documentElement;
  }

  ngAfterViewInit() {
    this.playButton = document.getElementById("play-button")
    this.duration = this.audioPlayerService.getDuration();
    this.currentTime = this.audioPlayerService.getCurrentTime();
  }

  resumeOrPause(): void {
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

  playAlbum(albumId: string) {
    this.audioPlayerService.playAlbum(albumId);
  }

  isPlaying(): boolean {
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

  isValid(): boolean {
    return Queue.getCurrentTrack() != undefined;
  }

  openFullScreenMode() {
    if (this.fullScreenElement.requestFullscreen) {
      this.fullScreenElement.requestFullscreen();
    } else if (this.fullScreenElement.mozRequestFullScreen) {
      this.fullScreenElement.mozRequestFullScreen();
    } else if (this.fullScreenElement.webkitRequestFullscreen) {
      this.fullScreenElement.webkitRequestFullscreen();
    } else if (this.fullScreenElement.msRequestFullscreen) {
      this.fullScreenElement.msRequestFullscreen();
    }
  }

  showConnectedDevices(): void {
    this._clicked = !this.clicked;
    let devices = this.audioPlayerService.getConnectedDevices();
    if (this._clicked) {
      console.log(devices.length)
      this._connectedDevices = devices;
    }
  }

  // @HostListener('window:keydown.space', ['$event'])
  // handleEvent() {
  //   this.resumeOrPause();
  // }

  get connectedDevices(): Device[] {
    if(this._connectedDevices.length <= 1) {
      return [];
    }
    return this._connectedDevices;
  }

  set clicked(value: boolean) {
    this._clicked = value;
  }

  get clicked(): boolean {
    return this._clicked;
  }

  switchDevice(id: string): void {
   let device = this.audioPlayerService.getCurrentActiveDevice();
   if(id != device?.deviceId) {
     this.audioPlayerService.switchDevice(id);
   }
  }
}
