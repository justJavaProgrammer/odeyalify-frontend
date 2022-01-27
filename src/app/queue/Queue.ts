import {Song} from "../audio-player/Song";
import {SongDto} from "../dto/SongDTO";

export class Queue {
  private static _queueSongs: SongDto[] = [];
  // private _prevSongsQueue: Song[] = [];
  private static nowPlaying?: SongDto;
  private static _songIndex: number = 0;

  constructor() {
  }

  static addTrackToQueue(track: SongDto, index?: number): void {
    if (index == undefined) {
      Queue.queueSongs.push(track);
    } else {
      Queue.queueSongs.splice(index, 0, track);
    }
  }

  static set queueSongs(songs: SongDto[]) {
    Queue._queueSongs = songs;
  }

  static getCurrentTrack(): SongDto | undefined {
    return Queue.queueSongs[Queue._songIndex];
  }

  static get queueSongs(): SongDto[] {
    return Queue._queueSongs;
  }

  static getNextTrack(): SongDto | undefined {
    if (Queue.currentQueueSize() > Queue.songIndex) {

      return this.queueSongs[++Queue._songIndex];
    }
    return undefined;
  }

  static getPrevTrack(): SongDto | undefined {
    if (Queue.songIndex > 0) {
      return this.queueSongs[--Queue._songIndex];
    }
    return undefined;
  }

  static clearQueue(): void {
    Queue.queueSongs = [];
  }


  static get songIndex(): number {
    return this._songIndex;
  }

  static currentQueueSize(): number {
    return Queue.queueSongs.length;
  }

  static fromIndex(index: number): void {
    this._songIndex = index;
  }
}
