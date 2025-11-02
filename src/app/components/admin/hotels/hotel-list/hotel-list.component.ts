import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface Hotel {
  id: number;
  nom_hotels: string;
  prix_agoda: number;
  prix_expedia: number;
  prix_booking: number;
  adresse: string;
  date_debut: string;
  date_fin: string;
  ville_arr: string;
  nbpers: number;
  nbrchambre: number;
  nbr_etoile: number;
  nbr_nuit: number;
  distance_haram: number;
  images: { image: string }[];
  localisation: string;
  collaborators: string[];
}

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadHotels();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No authentication token found');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  loadHotels() {
    this.loading = true;
    const url = `${environment.apiUrl}/hotels/hotels/`;
    console.log('Loading hotels from:', url);
    
    this.http.get<Hotel[]>(url, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        console.log('Hotels loaded:', data);
        this.hotels = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.error = 'Failed to load hotels';
        this.loading = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/no-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl}${imagePath}`;
  }

  deleteHotel(id: number) {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.loading = true;
      const url = `${environment.apiUrl}/hotels/hotels/${id}/`;
      console.log('Deleting hotel at:', url);
      this.http.delete(url, {
        headers: this.getAuthHeaders()
      }).subscribe({
        next: () => {
          this.successMessage = 'Hotel deleted successfully';
          this.loading = false;
          this.hotels = this.hotels.filter(hotel => hotel.id !== id);
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting hotel:', error);
          this.error = 'Failed to delete hotel';
          this.loading = false;
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  editHotel(id: number) {
    this.router.navigate(['/admin/hotels/edit', id]);
  }

  addHotel() {
    this.router.navigate(['/admin/hotels/add']);
  }
} 