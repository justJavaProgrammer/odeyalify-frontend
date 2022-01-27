import {AfterViewInit, Inject, Injectable} from "@angular/core";
import {HttpService} from "../http.service";
import {DOCUMENT} from "@angular/common";
import {Queue} from "../queue/Queue";
import {LocalStorageSavedAudioPlayerInstance} from "./LocalStorageSavedAudioPlayerInstance";
import {AlbumDTO} from "../dto/AlbumDTO";
import {SongDto} from "../dto/SongDTO";

@Injectable(
  {providedIn: "root"}
)
export class AudioPlayerService implements AfterViewInit {
  private streamUrl: string = "http://localhost:8888/stream/audio/";
  private timeProgress: any;
  private songQueue = new Queue();
  private audio = new Audio();
  private trackDuration: string = '0:00';
  private lastSong?: LocalStorageSavedAudioPlayerInstance;
  private isPlaying: boolean = false;

  constructor(private httpService: HttpService, @Inject(DOCUMENT) private document: Document) {}

  public init(): void {
    this.ngAfterViewInit();
    let item: LocalStorageSavedAudioPlayerInstance = JSON.parse(window.localStorage.getItem('lastSong')!);
    if (item != null) {
      this.audio.currentTime = item.currentTime;
      this.loadTrack(item.songDto?.songId!);
      this.httpService.getAlbumById(item.playbackEntityId).subscribe(value => {
        Queue.queueSongs = value.album.songs;
        Queue.fromIndex(item.fromIndex);
      });
    }
  }

  ngAfterViewInit(): void {
    let item = JSON.parse(window.localStorage.getItem('lastSong')!);
    this.loadTrack(item.songDto.streamUrl);
    this.trackDuration = this.getDuration();
    this.timeProgress = <HTMLInputElement>this.document.getElementById("time-range");
    this.trackDurationChange();
    this.timeProgressChangeListener();
    this.timeProgressOnInputListener();
    this.trackEndedListener();
  }

  public loadTrack(id: string): void {
    this.audio.src = this.streamUrl + id;
    this.audio.load();
  }

  public playSong(id: string): void {
    let songById = this.httpService.getSongById(id);
    songById.subscribe(data => {
      // let savedQueue: LocalStorageSavedQueue = new LocalStorageSavedQueue();
      window.localStorage.setItem('lastSong', JSON.stringify({
        songDto: data.songDto,
        playbackEntityId: data.songDto.albumId,
        fromIndex: Queue.songIndex
      }));
    })
    this.audio.play();
    this.isPlaying = true;
    this.calculateProgress();
  }

  public stopCurrentSong(): void {
    this.isPlaying = false;
    this.audio.pause();
  }

  prevSong(): void {
    let prevTrack = Queue.getPrevTrack();
    if(prevTrack != undefined) {
      this.loadTrack(prevTrack.songId)
      this.playSong(prevTrack.songId)
    }
  }

  nextSong(): void {
    let nextTrack = Queue.getNextTrack();
    if(nextTrack != undefined) {
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
      if(Queue.songIndex < Queue.currentQueueSize()) {
        let nextTrack = Queue.getNextTrack()!;
        this.loadTrack(nextTrack.songId)
        this.playSong(nextTrack.songId)
      } else {
        this.isPlaying = false;
      }
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

  playAlbum(albumId: string):void {
    this.httpService.getAlbumById(albumId).subscribe(data => {
      let album:AlbumDTO = JSON.parse(JSON.stringify(data.album));
      Queue.clearQueue();
      Queue.queueSongs = album.songs;
      let currentTrack = Queue.getCurrentTrack();
      console.log(currentTrack)
      this.loadTrack(currentTrack!.songId)
      this.playSong(currentTrack!.songId);
    })

  }

  resumePlaying(): void {
    this.audio.play();
    this.isPlaying = true;
  }

  getCurrentTrack(): SongDto | undefined {
    return Queue.getCurrentTrack();
  }
}
