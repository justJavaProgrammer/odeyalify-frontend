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
    console.log({email: email, password:password});
    return this.httpClient.post<any>(`${environment.baseUrl}auth/login`, {email: email, password:password}).pipe(
      map(userData => {
        let token = userData.jwtToken;
        localStorage.setItem('token', token);
        let refreshToken = userData.refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userData.information.userDto.userId);
        return userData;
      })
    )
  }
  public isUserLoggedIn() {
    return !(localStorage.getItem('token') === null)
  }

  public singOut() {
    localStorage.removeItem('token');
  }

  public refreshToken() {
    const refreshToken = {refreshToken: localStorage.getItem('refreshToken')}
    return this.httpClient.post<any>(`${environment.baseUrl}/auth/refreshtoken`, refreshToken)
  }

  public getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }
}
