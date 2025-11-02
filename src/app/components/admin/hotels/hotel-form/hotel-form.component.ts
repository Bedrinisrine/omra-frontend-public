import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface Hotel {
  id?: number;
  nom_hotels: string;
  prix: number;
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
  collaborators: string[];
  localisation: string;
  images: { id: number; image: string }[];
}

@Component({
  selector: 'app-hotel-form',
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class HotelFormComponent implements OnInit {
  hotelForm: FormGroup;
  hotelId: number | null = null;
  isEdit = false;
  loading = false;
  error = '';
  successMessage = '';
  existingImages: { id: number; image: string }[] = [];
  selectedFiles: File[] = []; // Property to store selected files (all images)

  COLLABORATOR_CHOICES = [
    { value: 'agoda', viewValue: 'Agoda' },
    { value: 'expedia', viewValue: 'Expedia' },
    { value: 'booking', viewValue: 'Booking.com' },
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.hotelForm = this.fb.group({
      nom_hotels: ['', Validators.required],
      prix: ['', Validators.required],
      prix_agoda: ['', Validators.required],
      prix_expedia: ['', Validators.required],
      prix_booking: ['', Validators.required],
      adresse: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      ville_arr: ['', Validators.required],
      nbpers: ['', Validators.required],
      nbrchambre: ['', Validators.required],
      nbr_etoile: ['', Validators.required],
      nbr_nuit: ['', Validators.required],
      distance_haram: ['', Validators.required],
      collaborators: [[]],
      localisation: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.hotelId = +id;
        this.isEdit = true;
        this.loadHotel(this.hotelId);
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  loadHotel(id: number): void {
    this.loading = true;
    this.http.get<Hotel>(`${environment.apiUrl}/hotels/hotels/${id}/`, { headers: this.getAuthHeaders() }).subscribe({
      next: (hotel) => {
        this.hotelForm.patchValue(hotel);
        this.existingImages = hotel.images || []; // Store existing images
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotel:', error);
        this.error = 'Failed to load hotel';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files); // Store all selected files
    console.log('Selected files:', this.selectedFiles);
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      const formData = new FormData();

      // Append form data
      Object.keys(this.hotelForm.value).forEach(key => {
        let value = this.hotelForm.value[key];
        if (key === 'collaborators') {
          value = JSON.stringify(value);
        }
        formData.append(key, value);
      });

      // Append all selected files under the 'uploaded_images' key
      console.log('Submitting with selected files:', this.selectedFiles);
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('uploaded_images', this.selectedFiles[i], this.selectedFiles[i].name);
      }

      if (this.isEdit && this.hotelId !== null) {
        // Update existing hotel
        this.http.put<Hotel>(`${environment.apiUrl}/hotels/hotels/${this.hotelId}/`, formData, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            this.successMessage = 'Hotel updated successfully!';
            this.loading = false;
            this.router.navigate(['/admin/hotels']);
          },
          error: (error) => {
            console.error('Error updating hotel:', error);
            this.error = 'Failed to update hotel';
            this.loading = false;
          }
        });
      } else {
        // Create new hotel
        this.http.post<Hotel>(`${environment.apiUrl}/hotels/hotels/`, formData, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            this.successMessage = 'Hotel created successfully!';
            this.loading = false;
            this.router.navigate(['/admin/hotels']);
          },
          error: (error) => {
            console.error('Error creating hotel:', error);
            this.error = 'Failed to create hotel';
            this.loading = false;
          }
        });
      }
    } else {
      this.error = 'Please fill in all required fields.';
    }
  }
  
  getImageUrl(imagePath: string): string {
    if (!imagePath) return ''; // Or a default image path
    if (imagePath.startsWith('http')) return imagePath;
    // Assuming backend serves media files from /media/
    return `${environment.apiUrl}${imagePath}`;
  }

  onCollaboratorChange(event: any) {
    const value = event.target.value;
    const checked = event.target.checked;
    const current = this.hotelForm.value.collaborators || [];
    if (checked) {
      this.hotelForm.patchValue({ collaborators: [...current, value] });
    } else {
      this.hotelForm.patchValue({ collaborators: current.filter((v: string) => v !== value) });
    }
  }
} 