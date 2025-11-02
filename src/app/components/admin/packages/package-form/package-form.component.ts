import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

interface Package {
  id?: number;
  nom_pak: string;
  prix: string; // Or number, depending on backend
  date_debut: string;
  date_fin: string;
  adr_hotel_medine: string;
  adr_hotel_mekka: string;
  nbr_jrs_mekka: number;
  nbr_jrs_medine: number;
  ville_depart: string;
  qte_package: number;
  agence: number; // Assuming agence is a foreign key to AgenceModel
  vol_retour: boolean;
  transfert_aeroport_hotel: boolean;
  guide: boolean;
  procedure_visa: boolean;
  petit_dejeuner: boolean;
  assistance_tel: boolean;
  assurance: boolean;
  visite_jabal_ouhoud: boolean;
  visite_masjid_quba: boolean;
  visite_souk_tamr: boolean;
  rite_orma: boolean;
  visite_mekka: boolean;
  visite_jabal_nour: boolean;
  omra_secondaire: boolean;
  aeroport_depart: string;
  hotels: number[]; // Assuming hotels is a ManyToManyField
  images: { id: number; image: string }[]; // For existing images
}

@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PackageFormComponent implements OnInit {
  packageForm: FormGroup;
  packageId: number | null = null;
  isEdit = false;
  loading = false;
  error = '';
  successMessage = '';
  existingImages: { id: number; image: string }[] = [];
  selectedFiles: File[] = []; // Property to store selected files (all images)

  // You might need a list of agencies and hotels for dropdowns
  agencies: any[] = []; 
  allHotels: any[] = [];
  selectedAgency: any = null; // For logo preview

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.packageForm = this.fb.group({
      nom_pak: ['', Validators.required],
      prix: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      adr_hotel_medine: ['', Validators.required],
      adr_hotel_mekka: ['', Validators.required],
      nbr_jrs_mekka: ['', Validators.required],
      nbr_jrs_medine: ['', Validators.required],
      ville_depart: ['', Validators.required],
      qte_package: ['', Validators.required],
      agence: ['', Validators.required], // Assuming required
      vol_retour: [false],
      transfert_aeroport_hotel: [false],
      guide: [false],
      procedure_visa: [false],
      petit_dejeuner: [false],
      assistance_tel: [false],
      assurance: [false],
      visite_jabal_ouhoud: [false],
      visite_masjid_quba: [false],
      visite_souk_tamr: [false],
      rite_orma: [false],
      visite_mekka: [false],
      visite_jabal_nour: [false],
      omra_secondaire: [false],
      aeroport_depart: ['', Validators.required],
      hotels: [[]], // Assuming hotels is a list of hotel IDs
    });
  }

  ngOnInit(): void {
    // Load agencies and hotels for dropdowns
    this.loadAgencies();
    this.loadAllHotels();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.packageId = +id;
        this.isEdit = true;
        this.loadPackage(this.packageId);
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

  loadPackage(id: number): void {
    this.loading = true;
    this.http.get<Package>(`${environment.apiUrl}/hotels/package/${id}/`, { headers: this.getAuthHeaders() }).subscribe({
      next: (packageData) => {
        this.packageForm.patchValue(packageData);
        this.existingImages = packageData.images || []; // Store existing images
        // You might need to handle the 'hotels' ManyToManyField separately here
        // this.packageForm.get('hotels')?.setValue(packageData.hotels.map(hotel => hotel.id)); // Example
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading package:', error);
        this.error = 'Failed to load package';
        this.loading = false;
      }
    });
  }

  loadAgencies(): void {
    // Implement agency loading logic
    this.http.get<any[]>(`${environment.apiUrl}/hotels/agencies/`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.agencies = data;
        console.log('Agencies loaded:', this.agencies);
      },
      error: (error) => {
        console.error('Error loading agencies:', error);
        // Handle error, e.g., show an error message
      }
    });
  }

  loadAllHotels(): void {
     // Implement all hotels loading logic for ManyToManyField
    this.http.get<any[]>(`${environment.apiUrl}/hotels/hotels/`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.allHotels = data;
        console.log('All Hotels loaded:', this.allHotels);
      },
      error: (error) => {
        console.error('Error loading all hotels:', error);
        // Handle error, e.g., show an error message
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    console.log('Selected files:', this.selectedFiles);
  }

  onAgencyChange(event: any): void {
    const agencyId = event.target.value;
    if (agencyId) {
      this.selectedAgency = this.agencies.find(agency => agency.id == agencyId);
    } else {
      this.selectedAgency = null;
    }
  }

  onSubmit(): void {
    if (this.packageForm.valid) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      const formData = new FormData();

      // Append form data
      Object.keys(this.packageForm.value).forEach(key => {
         // Handle boolean values for checkboxes if needed
         // if (typeof this.packageForm.value[key] === 'boolean') {
         //   formData.append(key, this.packageForm.value[key] ? 'True' : 'False');
         // } else {
           formData.append(key, this.packageForm.value[key]);
         // }
      });

      // Append all selected files under the 'uploaded_images' key
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('uploaded_images', this.selectedFiles[i], this.selectedFiles[i].name);
      }

      // Handle ManyToManyField 'hotels' separately if needed for submission
       const hotelIds = this.packageForm.get('hotels')?.value;
       if (hotelIds) {
         hotelIds.forEach((hotelId: number) => {
           formData.append('hotels', hotelId.toString());
         });
       }

      if (this.isEdit && this.packageId !== null) {
        // Update existing package
        this.http.put<Package>(`${environment.apiUrl}/hotels/package/${this.packageId}/`, formData, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            this.successMessage = 'Package updated successfully!';
            this.loading = false;
            this.router.navigate(['/admin/packages']);
          },
          error: (error) => {
            console.error('Error updating package:', error);
            this.error = 'Failed to update package';
            this.loading = false;
          }
        });
      } else {
        // Create new package
        this.http.post<Package>(`${environment.apiUrl}/hotels/package/`, formData, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            this.successMessage = 'Package created successfully!';
            this.loading = false;
            this.router.navigate(['/admin/packages']);
          },
          error: (error) => {
            console.error('Error creating package:', error);
            this.error = 'Failed to create package';
            this.loading = false;
          }
        });
      }
    } else {
      this.error = 'Please fill in all required fields.';
    }
  }
  
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl}${imagePath}`;
  }
} 