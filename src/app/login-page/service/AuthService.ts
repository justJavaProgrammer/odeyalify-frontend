import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
@Injectable(
  {providedIn: "root"}
)
export class AuthService {
  private JWT_TOKEN: string = "token";
  constructor(private httpClient: HttpClient) {
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  public refreshToken() {
    const refreshToken = {refreshToken: localStorage.getItem('refreshToken')}
    return this.httpClient.post<any>(`${environment.baseUrl}auth/refreshtoken`, refreshToken)
  }
  public saveJWTToken(token: string) {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.setItem(this.JWT_TOKEN, token);
  }
  public saveRefreshToken(token: string): void {
    localStorage.removeItem('refreshToken');
    localStorage.setItem('refreshToken', token);
  }
}
