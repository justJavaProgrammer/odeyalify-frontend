
export class SearchedArtistsResults {
  private _artistId: string = '';
  private _artistName: string = '';
  private _coverImage: string = '';
  private _isVerified: string = '';

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

  get isVerified(): string {
    return this._isVerified;
  }

  set isVerified(value: string) {
    this._isVerified = value;
  }
}
