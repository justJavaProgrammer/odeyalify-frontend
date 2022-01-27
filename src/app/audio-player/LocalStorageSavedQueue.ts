import {Queue} from "../queue/Queue";
import {SongDto} from "../dto/SongDTO";
import {Song} from "./Song";

export class LocalStorageSavedQueue {
  private _songs: SongDto[] = Queue.queueSongs;
  private _index: number = Queue.songIndex;


  get songs(): SongDto[] {
    return this._songs;
  }

  get index(): number {
    return this._index;
  }
}
