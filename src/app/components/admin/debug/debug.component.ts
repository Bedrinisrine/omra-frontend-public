import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Debug Information</h1>
      
      <h2>Authentication Status</h2>
      <p><strong>Token:</strong> {{ token ? 'Present' : 'Missing' }}</p>
      <p><strong>isAdmin:</strong> {{ isAdmin }}</p>
      <p><strong>Current URL:</strong> {{ currentUrl }}</p>
      
      <h2>Local Storage</h2>
      <pre>{{ localStorageInfo }}</pre>
      
      <h2>Actions</h2>
      <button (click)="clearStorage()" style="margin: 5px; padding: 10px;">Clear Storage</button>
      <button (click)="goToAdmin()" style="margin: 5px; padding: 10px;">Go to Admin</button>
      <button (click)="goToUser()" style="margin: 5px; padding: 10px;">Go to User</button>
      <button (click)="goToLogin()" style="margin: 5px; padding: 10px;">Go to Login</button>
    </div>
  `
})
export class DebugComponent implements OnInit {
  token: string | null = null;
  isAdmin: string | null = null;
  currentUrl: string = '';
  localStorageInfo: string = '';
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.updateDebugInfo();
    }
  }

  updateDebugInfo() {
    if (!this.isBrowser) return;
    
    this.token = localStorage.getItem('token');
    this.isAdmin = localStorage.getItem('isAdmin');
    this.currentUrl = window.location.href;
    
    const storage: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        storage[key] = localStorage.getItem(key);
      }
    }
    this.localStorageInfo = JSON.stringify(storage, null, 2);
  }

  clearStorage() {
    if (!this.isBrowser) return;
    localStorage.clear();
    this.updateDebugInfo();
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToUser() {
    this.router.navigate(['/user']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 