export class Song {
  private _id: string;
  private _name: string;
  private _streamUrl: string;


  constructor(id:string, name: string, streamUrl: string) {
    this._id = id;
    this._name = name;
    this._streamUrl = streamUrl;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get streamUrl(): string {
    return this._streamUrl;
  }

  set streamUrl(value: string) {
    this._streamUrl = value;
  }
}
