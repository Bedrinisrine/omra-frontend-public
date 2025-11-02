import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.is_staff = Boolean(user.is_staff);
        this.currentUserSubject.next(user);
        console.log('Restored user from storage:', user);
      }
    }
  }

  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
      console.log(`Set ${key} in localStorage:`, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
      console.log(`Removed ${key} from localStorage`);
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth service caught error:', error);
    return throwError(() => error);
  }

  login(username: string, password: string): Observable<User> {
    const url = `${environment.apiUrl}/api/auth/login/`;
    console.log('AuthService: Attempting login to:', url);
    return this.http.post<User>(url, { username, password })
      .pipe(
        tap(user => {
          console.log('AuthService: Login response received:', user);
          user.is_staff = Boolean(user.is_staff);
          this.setLocalStorage('currentUser', JSON.stringify(user));
          this.setLocalStorage('token', user.token);
          this.setLocalStorage('isAdmin', user.is_staff.toString());
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    this.removeLocalStorage('currentUser');
    this.removeLocalStorage('token');
    this.removeLocalStorage('isAdmin');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  isAdmin(): boolean {
    if (this.isBrowser) {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      console.log('AuthService: Checking admin status (from is_staff):', isAdmin);
      return isAdmin;
    }
    return false;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
} 