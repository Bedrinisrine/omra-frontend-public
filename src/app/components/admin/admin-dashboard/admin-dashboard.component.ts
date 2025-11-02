import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedbackModerationComponent } from '../feedback-moderation/feedback-moderation.component';
import { HotelListComponent } from '../hotels/hotel-list/hotel-list.component';
import { AdminPackageListComponent } from '../packages/package-list/package-list.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminDashboardComponent implements OnInit {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('AdminDashboardComponent: Component initialized');
      console.log('AdminDashboardComponent: Current URL:', window.location.href);
      console.log('AdminDashboardComponent: localStorage token:', !!localStorage.getItem('token'));
      console.log('AdminDashboardComponent: localStorage isAdmin:', localStorage.getItem('isAdmin'));
    }
  }

  logout() {
    // Clear all auth data
    if (this.isBrowser) {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }
}

export const adminRoutes = [
  { path: 'hotels', component: HotelListComponent },
  { path: 'packages', component: AdminPackageListComponent },
  { path: 'feedback-moderation', component: FeedbackModerationComponent },
  // ... other routes ...
]; 