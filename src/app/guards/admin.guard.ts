import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('AdminGuard: Checking route:', route.url);
    
    // Only check admin status for admin routes
    if (!route.url[0] || route.url[0].path !== 'admin') {
      console.log('AdminGuard: Non-admin route, allowing access');
      return true;
    }

    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      const token = localStorage.getItem('token');
      
      console.log('AdminGuard: Token found:', !!token);
      console.log('AdminGuard: isAdmin value:', isAdmin);
      
      // Check both token and admin status - BOTH must be true
      if (token && isAdmin === 'true') {
        console.log('AdminGuard: User is admin, allowing access');
        return true;
      }
    }
    
    console.log('AdminGuard: User is not admin or no token, redirecting to login');
    // If not admin or no token, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
} 