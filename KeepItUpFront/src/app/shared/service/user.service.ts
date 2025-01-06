import { Injectable } from '@angular/core';
import { User } from '../interfaces/users';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { USER_ROUTES } from '../routes/user-routes';
import { USERS_INFO_ROUTES } from '../routes/users-info-routes';

import { MSG } from '../constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authToken: string | null = null;
  private user: User | null = null;
  userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.authToken = localStorage.getItem('authToken');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(USER_ROUTES.list());
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(USER_ROUTES.get(id));
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(USER_ROUTES.registerfirststep(), user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(USER_ROUTES.update(id), user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(USER_ROUTES.delete(id));
  }

  loginUser(emailOrUsername: string, password: string): Observable<User> {
    const loginData = { email: emailOrUsername, password };
    return this.http
      .post<{ token: string }>(USER_ROUTES.authenticate(), loginData)
      .pipe(
        switchMap((response) => {
          const token = response.token;
          this.authToken = token;
          this.setAuthToken(token);
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
          return this.http.get<User>(USER_ROUTES.getinfo(), { headers });
        }),
        catchError((error) => {
          console.error(MSG.loginerror, error);
          let errorMessage: string;
          if (error.status === 401) {
            errorMessage = MSG.failedCredentials;
          } else {
            errorMessage = MSG.unknownLoginError;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getCurrentUser(): Observable<User> {
    if (!this.authToken) {
      console.error(MSG.noauthtoken);
      return throwError(() => new Error(MSG.notoken));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.get<User>(USER_ROUTES.getinfo(), { headers }).pipe(
      catchError((error) => {
        let errorMessage: string;
        if (error.status === 401) {
          errorMessage = MSG.unauthorized;
        } else {
          errorMessage = MSG.fetcherror;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  setUser(user: User) {
    this.user = user;
    this.userSubject.next(user);
  }

  logout() {
    this.user = null;
    this.userSubject.next(null);
    this.authToken = null;
    localStorage.removeItem('authToken')
    localStorage.removeItem('language');
    localStorage.removeItem('themeUser');
    localStorage.removeItem('userLanguage');
    this.translate.use('en'); 
  }
  fetchAndSetUser(): void {
    if (this.getToken()) {
      this.showinfo().subscribe((user) => {
        this.setUser(user);
      });
    }
  }
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  showinfo() {
    return this.http.get<any>(USER_ROUTES.getinfo());
  }

  setLanguageWithUserId(userId: number, lang: string): Observable<void> {
    const body = {
      userId: userId,
      language: lang,
    };

    return this.http
      .patch<void>(`${USERS_INFO_ROUTES.setLanguage()}`, body)
      .pipe(
        catchError((error) => {
          console.error('Failed to set language:', error);
          return throwError(() => new Error('Failed to set language.'));
        })
      );
  }

  setThemeWithUserId(userId: number, theme: string): Observable<void> {
    const body = {
      userId: userId,
      theme: theme,
    };

    return this.http
      .patch<void>(`${USERS_INFO_ROUTES.setTheme()}`, body)
      .pipe(
        catchError((error) => {
          console.error('Failed to set theme:', error);
          return throwError(() => new Error('Failed to set theme.'));
        })
      );
  }

  getUserInfo(userId: number): Observable<any> {
    return this.http.get<any>(USERS_INFO_ROUTES.getUsersInfo(userId)).pipe(
      catchError((error) => {
        console.error('Failed to fetch user info:', error);
        return throwError(() => new Error('Failed to fetch user info.'));
      })
    );
  }
  verifyCode(data: { email: string; code: string }): Observable<void> {
    return this.http.post<void>(USER_ROUTES.verifyCode(), data);
  }
}
