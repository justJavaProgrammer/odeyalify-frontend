enum ResultType {
  SONG = "SONG",
  PLAYLIST = "PLAYLIST",
  ALBUM = "ALBUM",
  ARTIST = "ARTIST"
}

export class TopResult {
  private _resultType?: ResultType;
  private _id?: string;
  private _name?: string;
  private _coverImage?: string;
  private _authorName?: string;
  private _authorId?: string;


  get resultType(): ResultType {
    return <ResultType>this._resultType;
  }

  set resultType(value: ResultType) {
    this._resultType = value;
  }

  get id(): string {
    return <string>this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return <string>this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get coverImage(): string {
    return <string>this._coverImage;
  }

  set coverImage(value: string) {
    this._coverImage = value;
  }

  get authorName(): string {
    return <string>this._authorName;
  }

  set authorName(value: string) {
    this._authorName = value;
  }

  get authorId(): string {
    return <string>this._authorId;
  }

  set authorId(value: string) {
    this._authorId = value;
  }
}
