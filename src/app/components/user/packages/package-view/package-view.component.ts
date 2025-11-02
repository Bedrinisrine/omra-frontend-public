import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StaticDataService } from '../../../../services/static-data.service';

interface Package {
  id: number;
  nom_pak: string;
  prix: string; // Or number
  date_debut: string;
  date_fin: string;
  adr_hotel_medine: string;
  adr_hotel_mekka: string;
  nbr_jrs_mekka: number;
  nbr_jrs_medine: number;
  ville_depart: string;
  qte_package: number;
  agence: any; // Adjust interface based on actual agence data if needed
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
  hotels: any[]; // Adjust interface based on actual hotel data if needed
  images: { image: string }[]; // For displaying images
}

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PackageViewComponent implements OnInit {
  packageData: Package | null = null;
  currentImageIndex: number = 0;
  error: string = '';
  loading: boolean = false;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private staticDataService: StaticDataService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.route.paramMap.subscribe(params => {
        const packageId = params.get('id');
        if (packageId) {
          this.loadPackage(+packageId);
        } else {
          this.error = 'Package ID not provided.';
        }
      });
    }
  }

  loadPackage(id: number): void {
    this.loading = true;
    const url = `${environment.apiUrl}/hotels/package/${id}/`; // Updated to match backend URL
    console.log('Loading package from:', url);

    this.http.get<Package>(url).subscribe({
      next: (data) => {
        console.log('Package loaded:', data);
        this.packageData = data;
        this.loading = false;
        this.currentImageIndex = 0; // Reset image index
      },
      error: (error) => {
        console.error('Error loading package:', error);
        console.log('API unavailable, using static data for demonstration');
        // Use static data when API fails (for demo purposes)
        const staticPkg = this.staticDataService.getPackageById(id);
        if (staticPkg) {
          this.packageData = staticPkg as Package;
          this.loading = false;
          this.currentImageIndex = 0;
        } else {
          this.error = 'Package not found.';
          this.loading = false;
        }
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/no-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    // If path starts with assets, use it directly (frontend asset)
    if (imagePath.startsWith('assets/')) return `/${imagePath}`;
    // If path starts with /media, it's a backend media path
    if (imagePath.startsWith('/media/') && environment.apiUrl) {
      return `${environment.apiUrl}${imagePath}`;
    }
    // Otherwise, treat as relative asset path
    return `/${imagePath}`;
  }

  nextImage() {
    if (this.packageData && this.packageData.images && this.currentImageIndex < this.packageData.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage() {
    if (this.packageData && this.packageData.images && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  // You might need methods to display associated hotels or agency details
  // displayHotelDetails(hotelId: number): void { ... }
  // displayAgencyDetails(agencyId: number): void { ... }
} 