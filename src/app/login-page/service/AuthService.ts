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
    return sessionStorage.getItem(this.JWT_TOKEN);
  }

  public refreshToken() {
    const refreshToken = {refreshToken: sessionStorage.getItem('refreshToken')}
    return this.httpClient.post<any>(`${environment.baseUrl}auth/refreshtoken`, refreshToken)
  }
  public saveJWTToken(token: string) {
    sessionStorage.removeItem(this.JWT_TOKEN);
    sessionStorage.setItem(this.JWT_TOKEN, token);
  }
  public saveRefreshToken(token: string): void {
    sessionStorage.removeItem('refreshToken');
    sessionStorage.setItem('refreshToken', token);
  }
}
