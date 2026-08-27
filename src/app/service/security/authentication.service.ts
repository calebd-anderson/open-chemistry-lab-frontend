import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserRegisterDto } from '../../model/user-register-dto';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string | null = null;

  public user = signal<User | null>(null);
  // public readonly user = this.user.asReadonly();
  public readonly isLoggedIn = computed(() => !!this.user());

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.loadToken();
    if (this.token) {
      try {
        const decoded = this.jwtHelper.decodeToken(this.token);
        if (decoded && decoded.sub && !this.jwtHelper.isTokenExpired(this.token)) {
          const cachedUser = this.getUserFromLocalCache();
          if (cachedUser && cachedUser.userId) {
            this.user.set(cachedUser);
          }
        } else {
          this.logOut();
        }
      } catch (e) {
        this.logOut();
      }
    }
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token ? this.token : '';
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public logOut(): void {
    this.token = null;
    this.user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/user/login`, user, {
      observe: 'response',
    }).pipe(
      tap(response => {
        const loggedInUser = response.body;
        if (loggedInUser) {
          this.user.set(loggedInUser);
          this.addUserToLocalCache(loggedInUser);
        }
      })
    );
  }

  public register(user: UserRegisterDto): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  public updateUser(user: User): void {
    this.user.set(user);
    this.addUserToLocalCache(user);
  }

  // Deprecated: use isLoggedIn signal or user signal instead
  public isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }
}
