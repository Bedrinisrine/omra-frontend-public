import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feedback-moderation',
  templateUrl: './feedback-moderation.component.html',
  styleUrls: ['./feedback-moderation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FeedbackModerationComponent implements OnInit {
  feedbacks: any[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
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

  rejectFeedback(id: number) {
    if (!environment.apiUrl) return;
    if (confirm('Voulez-vous vraiment rejeter ce commentaire ?')) {
      this.http.patch(`${environment.apiUrl}/hotels/feedback/${id}/`, { rejected: true }).subscribe({
        next: () => this.loadFeedbacks(),
        error: () => alert('Erreur lors du rejet de l\'avis.')
      });
    }
  }
} 