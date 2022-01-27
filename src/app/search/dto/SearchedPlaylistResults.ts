export class SearchedPlaylistResults {
  private _playlistId: string = '';
  private _playlistName: string = '';
  private _coverImage: string = '';
  private _authorId: string = '';
  private _authorName: string = '';

  get playlistId(): string {
    return this._playlistId;
  }

  set playlistId(value: string) {
    this._playlistId = value;
  }

  get playlistName(): string {
    return this._playlistName;
  }

  set playlistName(value: string) {
    this._playlistName = value;
  }

  get coverImage(): string {
    return this._coverImage;
  }

  set coverImage(value: string) {
    this._coverImage = value;
  }

  get authorId(): string {
    return this._authorId;
  }

  set authorId(value: string) {
    this._authorId = value;
  }

  get authorName(): string {
    return this._authorName;
  }

  set authorName(value: string) {
    this._authorName = value;
  }
}
