import { Injectable, signal, computed } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
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
  public readonly isLoggedIn = computed(() => !!this.user() || !!this.token);

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
          this.getCurrentUser().subscribe({
            error: (error) => {
              if (
                error instanceof HttpErrorResponse &&
                error.status === 401
              ) {
                this.logOut();
              }
              console.error('Failed to load the current user', error);
            },
          });
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
    localStorage.removeItem('token');
  }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http
      .post<User>(`${this.host}/auth/login`, user, {
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          const loggedInUser = response.body;
          if (loggedInUser) {
            this.user.set(loggedInUser);
          }
        }),
      );
  }

  public register(user: UserRegisterDto): Observable<User> {
    return this.http.post<User>(`${this.host}/auth/register`, user);
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.host}/auth/me`).pipe(
      tap((user) => this.user.set(user)),
    );
  }

  public updateUser(user: User): void {
    this.user.set(user);
  }

  // Deprecated: use isLoggedIn signal or user signal instead
  public isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }
}
