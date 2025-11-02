import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

interface Agency {
  id: number;
  nomagence: string;
  logo_agence?: string;
  adr_agence?: string;
  tel?: number;
}

@Component({
  selector: 'app-agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AgencyListComponent implements OnInit {
  agencies: Agency[] = [];
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadAgencies(): void {
    this.loading = true;
    this.http.get<Agency[]>(`${environment.apiUrl}/hotels/agencies/`, { 
      headers: this.getAuthHeaders() 
    }).subscribe({
      next: (data) => {
        this.agencies = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading agencies:', error);
        this.error = 'Failed to load agencies';
        this.loading = false;
      }
    });
  }

  editAgency(agency: Agency): void {
    this.router.navigate(['/admin/agencies/edit', agency.id]);
  }

  deleteAgency(agencyId: number): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.http.delete(`${environment.apiUrl}/hotels/agencies/${agencyId}/`, { 
        headers: this.getAuthHeaders() 
      }).subscribe({
        next: () => {
          this.loadAgencies(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting agency:', error);
          this.error = 'Failed to delete agency';
        }
      });
    }
  }

  addNewAgency(): void {
    this.router.navigate(['/admin/agencies/add']);
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return `${environment.apiUrl}${imagePath}`;
  }
} 