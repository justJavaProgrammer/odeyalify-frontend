export class JWTResponse {
  constructor(public _jwtToken: string) {
  }

  get jwtToken(): string {
    return this._jwtToken;
  }

  set jwtToken(value: string) {
    this._jwtToken = value;
  }
}
