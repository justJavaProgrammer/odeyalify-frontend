import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private httpClient: HttpClient) {

  }

  public login(email: string, password: string) {
    console.log(email , password);
    return this.httpClient.post<any>(`${environment.baseUrl}auth/login`, {email: email, password:password}).pipe(
      map(userData => {
        let token = userData.jwtToken;
        sessionStorage.setItem('token', token);
        let refreshToken = userData.refreshToken;
        sessionStorage.setItem("refreshToken", refreshToken);
        return userData;
      })
    )
  }
  public isUserLoggedIn() {
    return !(sessionStorage.getItem('token') === null)
  }

  public singOut() {
    sessionStorage.removeItem('token');
  }

  public refreshToken() {
    const refreshToken = {refreshToken: sessionStorage.getItem('refreshToken')}
    return this.httpClient.post<any>(`${environment.baseUrl}/auth/refreshtoken`, refreshToken)
  }

  public getRefreshToken() {
    return sessionStorage.getItem('refreshToken')
  }
}
