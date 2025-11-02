import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminHomeComponent implements OnInit {
  feedbacks: any[] = [];
  loading = false;
  error = '';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('AdminHomeComponent: Component initialized');
      console.log('AdminHomeComponent: Current URL:', window.location.href);
      console.log('AdminHomeComponent: localStorage token:', !!localStorage.getItem('token'));
      console.log('AdminHomeComponent: localStorage isAdmin:', localStorage.getItem('isAdmin'));
    }
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    if (!environment.apiUrl) {
      this.loading = false;
      this.error = '';
      this.feedbacks = [];
      return;
    }
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/hotels/feedback/?all=1`).subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des avis.';
        this.loading = false;
      }
    });
  }

  approveFeedback(id: number) {
    if (!environment.apiUrl) return;
    this.http.patch(`${environment.apiUrl}/hotels/feedback/${id}/`, { approved: true }).subscribe({
      next: () => this.loadFeedbacks(),
      error: () => alert('Erreur lors de l\'approbation de l\'avis.')
    });
  }
} 