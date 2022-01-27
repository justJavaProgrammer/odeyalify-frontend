export class SearchedSongsResults {
  private _songId: string = '';
  private _songName: string = '';
  private _artistId: string = '';
  private _artistName: string = '';
  private _coverImage: string = '';

  get songId(): string {
    return this._songId;
  }

  set songId(value: string) {
    this._songId = value;
  }

  get songName(): string {
    return this._songName;
  }

  set songName(value: string) {
    this._songName = value;
  }

  get artistId(): string {
    return this._artistId;
  }

  set artistId(value: string) {
    this._artistId = value;
  }

  get artistName(): string {
    return this._artistName;
  }

  set artistName(value: string) {
    this._artistName = value;
  }

  get coverImage(): string {
    return this._coverImage;
  }

  set coverImage(value: string) {
    this._coverImage = value;
  }
}

