import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

interface Package {
  id: number;
  nom_pak: string;
  prix: string;
  date_debut: string;
  date_fin: string;
  ville_depart: string;
  qte_package: number;
  // Add other fields you might need for the list view
}

@Component({
  selector: 'app-admin-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminPackageListComponent implements OnInit {
  packages: Package[] = [];
  error: string = '';
  loading: boolean = false;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    public router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
     this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
     if (this.isBrowser) {
      this.loadPackages();

      // Subscribe to router events to reload packages when navigating back to this route
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/admin/packages')
      ).subscribe(() => {
        console.log('Navigated back to /admin/packages, reloading packages.');
        this.loadPackages();
      });
     }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return new HttpHeaders(); // Return empty headers if no token
    }
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  loadPackages(): void {
    if (!this.isBrowser) return;
    
    this.loading = true;
    this.http.get<Package[]>(`${environment.apiUrl}/hotels/package/`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading packages:', error);
        this.error = 'Failed to load packages';
        this.loading = false;
      }
    });
  }

  editPackage(packageItem: Package): void {
    this.router.navigate(['/admin/packages/edit', packageItem.id]);
  }

  deletePackage(packageItem: Package): void {
    if (!confirm(`Are you sure you want to delete package "${packageItem.nom_pak}"?`)) {
      return;
    }

    const headers = this.getAuthHeaders();
    if (!headers.get('Authorization')) {
       // If no auth headers, navigation to login already handled in getAuthHeaders
       return;
    }

    this.loading = true;
    this.http.delete(`${environment.apiUrl}/hotels/package/${packageItem.id}/`, { headers }).subscribe({
      next: () => {
        this.packages = this.packages.filter(p => p.id !== packageItem.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error deleting package:', error);
        this.error = 'Failed to delete package';
        this.loading = false;
      }
    });
  }

  addPackage(): void {
    this.router.navigate(['/admin/packages/new']);
  }

} 