import {Queue} from "../queue/Queue";
import {SongDto} from "../dto/SongDTO";
import {LocalStorageSavedQueue} from "./LocalStorageSavedQueue";

export class LocalStorageSavedAudioPlayerInstance {
  // private _localStorageQueue: LocalStorageSavedQueue = new LocalStorageSavedQueue();
  private _songDto?: SongDto;
  private _currentTime: number = 0;
  private _playbackEntityId: string = '';
  private _fromIndex: number = 0;

  // get localStorageQueue(): LocalStorageSavedQueue {
  //   return this._localStorageQueue;
  // }
  //
  // set localStorageQueue(value: LocalStorageSavedQueue) {
  //   this._localStorageQueue = value;
  // }

  get songDto(): SongDto | undefined {
    return this._songDto;
  }

  set songDto(value: SongDto | undefined) {
    this._songDto = value;
  }

  get currentTime(): number {
    return this._currentTime;
  }

  set currentTime(value: number) {
    this._currentTime = value;
  }


  get playbackEntityId(): string {
    return this._playbackEntityId;
  }

  set playbackEntityId(value: string) {
    this._playbackEntityId = value;
  }

  get fromIndex(): number {
    return this._fromIndex;
  }

  set fromIndex(value: number) {
    this._fromIndex = value;
  }
}
