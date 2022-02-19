import {AfterViewInit, Inject, Injectable, OnDestroy, OnInit} from "@angular/core";
import {HttpService} from "../http.service";
import {DOCUMENT} from "@angular/common";
import {Queue} from "../queue/Queue";
import {LocalStorageSavedAudioPlayerInstance} from "./LocalStorageSavedAudioPlayerInstance";
import {AlbumDTO} from "../dto/AlbumDTO";
import {SongDto} from "../dto/SongDTO";
import {AudioPlayerWebSocketSyncHandler} from "./sync/AudioPlayerWebSocketSyncHandler";
import {AudioPlayerStateDTO} from "./sync/AudioPlayerStateDTO";
import {Device} from "./sync/Device";
import {ActionEventType} from "./sync/ActionEventType";
import {PlayerStateChangeDTO} from "./sync/PlayerStateChangeDTO";

/**
 *
 *VERY BAD CODE. MAYBE I WILL CHANGE IT IN FUTURE, BUT NO TIME FOR THIS NOW
 */
@Injectable(
  {providedIn: "root"}
)
export class AudioPlayerService implements OnInit, AfterViewInit, OnDestroy {
  private timeProgress: any;
  private songQueue = new Queue();
  private audio = new Audio();
  private trackDuration: string = '0:00';
  private lastSong?: LocalStorageSavedAudioPlayerInstance;
  private isPlaying: boolean = false;
  private volume: any;
  private thisDeviceId: string = '';
  private streamUrl: string = "http://localhost:8888/stream/audio/";
  private interval: number = 0;

  constructor(private httpService: HttpService, @Inject(DOCUMENT) private document: Document,
              private audioPlayerWebSocketSyncHandler: AudioPlayerWebSocketSyncHandler) {
  }

  ngOnInit(): void {
    console.log("Trying to open web socket connection...")
  }

  ngOnDestroy(): void {
  }

  public init(): void {
    this.ngAfterViewInit();
    let item: LocalStorageSavedAudioPlayerInstance = JSON.parse(window.localStorage.getItem('lastSong')!);
    if (item != null) {
      this.audio.currentTime = item.currentTime;
      this.loadTrack(item.songDto?.songId!);
      this.httpService.getAlbumById(item.playbackEntityId).subscribe((value) => {
        Queue.queueSongs = value.album.songs;
        Queue.fromIndex(item.fromIndex);
        this.audioPlayerWebSocketSyncHandler.openWebSocketSession(new AudioPlayerStateDTO(this.audioPlayerWebSocketSyncHandler.getCurrentActiveDevice()!,
          this.getCurrentTrack()?.songId!, this.audio.volume, this.audio.currentTime, this.isPlaying));
        this.registerWebsocketListeners();
      });
    }
  }

  ngAfterViewInit(): void {
    let item = JSON.parse(window.localStorage.getItem('lastSong')!);
    this.loadTrack(item.songDto.streamUrl);
    this.trackDuration = this.getDuration();
    this.timeProgress = <HTMLInputElement>this.document.getElementById("time-range");
    this.volume = <HTMLInputElement>this.document.getElementById("volume");
    this.trackDurationChange();
    this.timeProgressChangeListener();
    this.timeProgressOnInputListener();
    this.trackEndedListener();
    this.volumeChangeListener();
    if (this.audioPlayerWebSocketSyncHandler.getConnectedDevices().length != 1) {
      this.httpService.getPlayerStateOnConnect().subscribe(value => {
        let currentSongId = value.currentSongId;
        let time = value.time;
        let volume = value.volume;
        this.loadTrack(currentSongId);
        this.audio.volume = volume;
        this.audio.currentTime = time;
      });
    }
  }

  private registerWebsocketListeners(): void {
    this.playEventListener();
    this.pauseEventListener();
    this.volumeChangeEventListener();
    this.switchDeviceEventListener();
    this.songChangeEventListener();
  }

  public loadTrack(id: string): void {
    this.audio.src = this.streamUrl + id;
    this.audio.load();
  }

  /*
   {
   event: PAUSE,
   player: {
      activeDevice: 1,
      time: 1,
      volume: 2,

    }
   }
   */
  public playSong(id: string): void {
    if (id != undefined) {
      let songById = this.httpService.getSongById(id);
      songById.subscribe(data => {
        window.localStorage.setItem('lastSong', JSON.stringify({
          songDto: data.songDto,
          playbackEntityId: data.songDto.albumId,
          fromIndex: Queue.songIndex
        }));
      })
      if (this.audioPlayerWebSocketSyncHandler.isCurrentDeviceActive()) {
        this.audio.play();
      }
      this.isPlaying = true;
      this.audioPlayerWebSocketSyncHandler.sendMessage(new PlayerStateChangeDTO(ActionEventType.SONG_CHANGE,
        new AudioPlayerStateDTO(this.getCurrentActiveDevice()!, id, this.audio.volume, this.audio.currentTime,
          this.isPlaying)));
      this.calculateProgress();

    }
  }

  public stopCurrentSong(): void {
    this.isPlaying = false;
    this.audio.pause();
    this.audioPlayerWebSocketSyncHandler.sendMessage(
      new PlayerStateChangeDTO(ActionEventType.PAUSE,
        new AudioPlayerStateDTO(this.audioPlayerWebSocketSyncHandler.getCurrentActiveDevice()!,
          this.getCurrentTrack()?.songId!, this.audio.volume, this.audio.currentTime, false)));
  }

  prevSong(): void {
    let prevTrack = Queue.getPrevTrack();
    console.log(prevTrack)
    if (prevTrack != undefined) {
      this.loadTrack(prevTrack.songId)
      this.playSong(prevTrack.songId)
    }
  }

  nextSong(): void {
    let nextTrack = Queue.getNextTrack();
    if (nextTrack != undefined) {
      this.loadTrack(nextTrack.songId);
      this.playSong(nextTrack.songId);

    }
  }

  timeProgressOnInputListener(): void {
    this.timeProgress.addEventListener("input", () => {
      this.audio.currentTime = (this.timeProgress.value / 100) * this.audio.duration;
    })
  }

  trackDurationChange(): void {
    this.audio.addEventListener("timeupdate", (event) => {
      this.timeProgress.value = this.calculateProgress();
      this.getCurrentTime();
      let lastSong = window.localStorage.getItem('lastSong');
      if (lastSong != null || lastSong != undefined) {
        let item = JSON.parse(lastSong!);
        item.currentTime = this.audio.currentTime;
        window.localStorage.removeItem('lastSong');
        window.localStorage.setItem('lastSong', JSON.stringify(item));
      }
    })
  }

  timeProgressChangeListener(): void {
    this.timeProgress.addEventListener("change", () => {
      this.audio.currentTime = (this.timeProgress.value / 100) * this.audio.duration;
    })
  }

  trackEndedListener(): void {
    this.audio.addEventListener("ended", (event) => {
      if (Queue.songIndex < Queue.currentQueueSize()) {
        let nextTrack = Queue.getNextTrack()!;
        if (nextTrack != undefined) {
          this.loadTrack(nextTrack.songId)
          this.playSong(nextTrack.songId)
        }
      } else {
        this.isPlaying = false;
      }
    })
  }

  volumeChangeListener(): void {
    this.volume.addEventListener("input", () => {
      let value = this.volume.value;
      this.changeVolume(value);
      console.log(this.getIsPlaying())
      this.audioPlayerWebSocketSyncHandler.sendMessage(new PlayerStateChangeDTO(ActionEventType.VOLUME_CHANGE,
        new AudioPlayerStateDTO(this.audioPlayerWebSocketSyncHandler.getCurrentActiveDevice()!,
          this.getCurrentTrack()?.songId!, value, this.audio.currentTime, this.getIsPlaying())));
    })
  }

  private calculateProgress(): number {
    let duration = this.audio.duration;
    let currentTime = this.audio.currentTime;
    return (currentTime / duration) * 100;
  }


  getDuration(): string {
    this.audio.addEventListener("loadedmetadata", (event) => {
      let duration = this.audio.duration;
      let minutes = Math.floor(duration / 60);
      let seconds = Math.round(duration - minutes * 60);
      if (seconds < 10) {
        this.trackDuration = minutes + ':0' + seconds;
      } else {
        this.trackDuration = minutes + ":" + seconds;
      }
    })
    return this.trackDuration;
  }

  getCurrentTime(): string {
    let currentTime = this.audio.currentTime;
    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.round(currentTime - minutes * 60);
    if (currentTime == this.audio.duration) {
      return this.getDuration();
    }
    if (seconds < 10) {
      return minutes + ':0' + seconds;
    }
    return minutes + ':' + seconds;
  }

  public getSongQueue(): Queue {
    return this.songQueue;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  playAlbum(albumId: string): void {
    this.httpService.getAlbumById(albumId).subscribe(data => {
      let album: AlbumDTO = JSON.parse(JSON.stringify(data.album));
      Queue.clearQueue();
      Queue.resetIndex();
      Queue.queueSongs = album.songs;
      let currentTrack = Queue.getCurrentTrack();
      this.loadTrack(currentTrack!.songId)
      this.playSong(currentTrack!.songId);
    })
  }

  resumePlaying(): void {
    if (this.audioPlayerWebSocketSyncHandler.isCurrentDeviceActive()) {
      this.audio.play();
    }
    this.isPlaying = true;
    this.audioPlayerWebSocketSyncHandler.sendMessage(new PlayerStateChangeDTO(ActionEventType.PLAY,
      new AudioPlayerStateDTO(this.audioPlayerWebSocketSyncHandler.getCurrentActiveDevice()!,
        this.getCurrentTrack()?.songId!, this.audio.volume, this.audio.currentTime, true)));
    // this.audioPlayerWebSocketSyncHandler.resumePlaying(Queue.getCurrentTrack()?.songId!, this.getIsPlaying(),
    // this.audio.volume,
    // this.audio.currentTime)
  }

  changeVolume(value: number): void {
    this.audio.volume = value / 100;
    this.volume.value = value;
    console.log(this.volume.value)
  }

  getCurrentTrack(): SongDto | undefined {
    return Queue.getCurrentTrack();
  }

  playEventListener(): void {
    document.addEventListener("PLAY", (event) => {
      this.isPlaying = true;
      let customEvent = <CustomEvent>event;
      this.playWsEvent(customEvent);
    })
  }

  private playWsEvent(customEvent: CustomEvent) {
    const detail = customEvent.detail;
    this.audio.currentTime = detail.time;
    console.log("id: " + this.audioPlayerWebSocketSyncHandler.getCurrentActiveDevice()?.deviceId + " active " + this.audioPlayerWebSocketSyncHandler.isCurrentDeviceActive())
    if (this.audioPlayerWebSocketSyncHandler.isCurrentDeviceActive()) {
      clearInterval(this.interval);
      this.audio.play();
    } else {
      this.updateTime();
    }
  }

  pauseEventListener(): void {
    document.addEventListener("PAUSE", (event) => {
      this.isPlaying = false;
      this.audio.pause();
      clearInterval(this.interval);
    })
  }

  volumeChangeEventListener(): void {
    document.addEventListener("VOLUME_CHANGE", (event) => {
      let customEvent = <CustomEvent>event;
      const detail = customEvent.detail;
      this.changeVolume(detail.volume);
    })
  }

  switchDeviceEventListener(): void {
    document.addEventListener("DEVICE_SWITCH", (event) => {
      let customEvent = <CustomEvent>event;
      const detail = customEvent.detail;
      let deviceId = detail.activeDevice.deviceId;
      this.audioPlayerWebSocketSyncHandler.setActiveDevice(deviceId);
      console.log(detail.playing)
      if (detail.playing) {
        this.playWsEvent(detail);
        if (this.audioPlayerWebSocketSyncHandler.isCurrentDeviceActive()) {
          this.audio.pause();
        }
      }
    })
  }

  songChangeEventListener(): void {
    document.addEventListener("SONG_CHANGE", (event) => {
      console.log("song_change")
      let customEvent = <CustomEvent>event;
      const detail = customEvent.detail;
      console.log("detail.state: " + detail.currentSongId)
      if (!this.audioPlayerWebSocketSyncHandler.isCurrentDeviceActive()) {
        this.loadTrack(detail.currentSongId);
        console.log(this.getCurrentTrack());
      }
    })
  }

  // getConnectedDevices(): Device[] {
  // return this.audioPlayerWebSocketSyncHandler.getConnectedDevices();

  // }
  getConnectedDevices(): Device[] {
    return this.audioPlayerWebSocketSyncHandler.getConnectedDevices();
  }

  updateTime() {
    this.interval = setInterval(() => {
      this.audio.currentTime = this.audio.currentTime + 1;
      // console.log(this.audio.currentTime)
    }, 1000);
  }

  getCurrentActiveDevice() {
    return this.audioPlayerWebSocketSyncHandler.getCurrentActiveDevice();
  }

  switchDevice(id: string) {
    this.audioPlayerWebSocketSyncHandler.switchDevice(new PlayerStateChangeDTO(ActionEventType.DEVICE_SWITCH,
      new AudioPlayerStateDTO(this.getSwitchedDevice(id)!, this.getCurrentTrack()?.songId!,
        this.audio.volume, this.audio.currentTime, this.getIsPlaying())));
  }

  getSwitchedDevice(id: string) {
    let devices = this.audioPlayerWebSocketSyncHandler.getConnectedDevices();
    for (let i = 0; i < devices.length; i++) {
      let device = devices[i];
      if (device.deviceId == id) {
        return device;
      }
    }
    return undefined;
  }
}
