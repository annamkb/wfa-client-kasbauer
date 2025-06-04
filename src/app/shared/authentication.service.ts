import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import {environment} from '../../environments/environment';

interface Token {
  exp: number;
  user : {
    id:string;
    role:string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private api = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(`${this.api}/login`, {email, password})
  }

  logout() {
    this.http.post(`${this.api}/logout`, {})
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
  }

  public isLoggedIn(): boolean {
    if(sessionStorage.getItem("token")){
      let token: string = <string>sessionStorage.getItem("token");
      const decodedToken = jwtDecode(token) as Token;
      let expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      if(expirationDate < new Date()) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        return false;
      }
      return true;
    }else {
      return false;
    }
  }

  public getCurrentUserId(): number {
    return Number.parseInt(<string>sessionStorage.getItem("userId") || "-1");
  }

  public getCurrentUser(): { id: number } | null {
    const userId = this.getCurrentUserId();
    return userId ? { id: userId } : null;
  }

  public getCurrentUserRole(): string {
    return sessionStorage.getItem("role") || "";
  }


  setSessionStorage(access_token: string) {
    const decodedToken = jwtDecode(access_token) as Token;
    sessionStorage.setItem("token", access_token);
    sessionStorage.setItem("userId", decodedToken.user.id);
    sessionStorage.setItem("role", decodedToken.user.role);

  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
}
