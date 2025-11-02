import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('AuthGuard: Checking route:', route.url);
    
    // For non-admin routes, allow access
    if (!route.url[0] || route.url[0].path !== 'admin') {
      console.log('AuthGuard: Non-admin route, allowing access');
      return true;
    }

    // For admin routes, check authentication
    if (!this.isBrowser) {
      console.log('AuthGuard: Not in browser, denying access');
      return false;
    }

    const token = localStorage.getItem('token');
    console.log('AuthGuard: Token found:', !!token);
    
    if (!token) {
      console.log('AuthGuard: No token found, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('AuthGuard: Token found, allowing access');
    return true;
  }
} 