import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaticDataService } from '../../../../services/static-data.service';

interface Package {
  id: number;
  nom_pak: string;
  prix: string;
  date_debut: string;
  date_fin: string;
  ville_depart: string;
  qte_package: number;
  images: { image: string }[];
  nbr_nuit: number;
  adr_hotel_medine?: string;
  adr_hotel_mekka?: string;
  nbr_jrs_mekka?: number;
  nbr_jrs_medine?: number;
  agence?: { 
    id: number;
    nomagence: string;
    logo_agence?: string;
    adr_agence?: string;
    tel?: number;
  };
}

interface PackageWithStatus extends Package {
  status: 'available' | 'limited' | 'last_places' | 'sold_out';
  statusText: string;
  statusColor: string;
}

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class PackageListComponent implements OnInit {
  packages: Package[] = [];
  packagesWithStatus: PackageWithStatus[] = [];
  error: string = '';
  loading: boolean = false;
  private isBrowser: boolean;

  // Add properties for the search bar and filters
  selectedTab: 'package' | 'hotel' | 'flight' = 'package';
  
  // Form fields for each tab
  packageDeparture: string = '';
  packageDate: string = '';
  hotelCity: 'Makkah' | 'Madinah' = 'Makkah';
  hotelDate: string = '';
  flightFrom: string = '';
  flightTo: string = '';
  flightDate: string = '';
  selectedOmraFilter: string = '';

  // Status thresholds
  private readonly LIMITED_THRESHOLD = 10; // Show "Limited places" when <= 10
  private readonly LAST_PLACES_THRESHOLD = 3; // Show "Last places" when <= 3
  private readonly SOLD_OUT_THRESHOLD = 0; // Show "Sold out" when = 0

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private staticDataService: StaticDataService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadPackages();
      this.handleQueryParams();
    }
  }

  private handleQueryParams() {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const departure = urlParams.get('departure');
    const date = urlParams.get('date');
    
    if (departure) {
      this.packageDeparture = departure;
    }
    
    if (date) {
      this.packageDate = date;
    }
  }

  private calculatePackageStatus(pkg: Package): PackageWithStatus {
    let status: 'available' | 'limited' | 'last_places' | 'sold_out' = 'available';
    let statusText = '';
    let statusColor = '';

    if (pkg.qte_package <= this.SOLD_OUT_THRESHOLD) {
      status = 'sold_out';
      statusText = 'Épuisé';
      statusColor = '#dc3545'; // Red
    } else if (pkg.qte_package <= this.LAST_PLACES_THRESHOLD) {
      status = 'last_places';
      statusText = `Dernières places !! (${pkg.qte_package} restantes)`;
      statusColor = '#d32f2f'; // Dark red
    } else if (pkg.qte_package <= this.LIMITED_THRESHOLD) {
      status = 'limited';
      statusText = `Places limitées !! (${pkg.qte_package} restantes)`;
      statusColor = '#bfa046'; // Golden
    } else {
      status = 'available';
      statusText = '';
      statusColor = '';
    }

    return {
      ...pkg,
      status,
      statusText,
      statusColor
    };
  }

  private updatePackagesWithStatus() {
    this.packagesWithStatus = this.packages.map(pkg => this.calculatePackageStatus(pkg));
  }

  get filteredPackages(): PackageWithStatus[] {
    let filtered = this.packagesWithStatus;

    // Filter by Omra type if selected
    if (this.selectedOmraFilter) {
      filtered = filtered.filter(pkg => {
        const startDate = new Date(pkg.date_debut);
        if (this.selectedOmraFilter === 'omraAgu2025') {
          return startDate.getMonth() === 7;
        } else if (this.selectedOmraFilter === 'omraSep2025') {
          return startDate.getMonth() === 8;
        } else if (this.selectedOmraFilter === 'omraRamadan2025') {
          return startDate.getMonth() === 2;
        }
        return true;
      });
    }

    // Filter by departure city if specified
    if (this.packageDeparture) {
      filtered = filtered.filter(pkg => 
        pkg.ville_depart && pkg.ville_depart.includes(this.packageDeparture)
      );
    }

    // Filter by date if specified
    if (this.packageDate) {
      const selectedDate = new Date(this.packageDate);
      filtered = filtered.filter(pkg => {
        const packageStartDate = new Date(pkg.date_debut);
        const packageEndDate = new Date(pkg.date_fin);
        return selectedDate >= packageStartDate && selectedDate <= packageEndDate;
      });
    }

    return filtered;
  }

  setOmraFilter(filter: string) {
    this.selectedOmraFilter = filter;
  }

  loadPackages() {
    if (!this.isBrowser) return;
    
    this.loading = true;
    const url = `${environment.apiUrl}/hotels/package/`;
    console.log('Loading packages from:', url);
    
    this.http.get<Package[]>(url).subscribe({
      next: (data) => {
        console.log('Packages loaded:', data);
        if (data && data.length > 0) {
          this.packages = data;
        } else {
          // Use static data if API returns empty
          this.packages = this.staticDataService.getStaticPackages() as Package[];
        }
        this.updatePackagesWithStatus();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading packages:', error);
        console.log('API unavailable, using static data for demonstration');
        // Use static data when API fails (for demo purposes)
        this.packages = this.staticDataService.getStaticPackages() as Package[];
        this.updatePackagesWithStatus();
        this.loading = false;
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '/assets/images/kaaba.jpg';
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If path starts with assets, use it directly (frontend asset)
    if (imagePath.startsWith('assets/')) {
      return '/' + imagePath;
    }
    // If path starts with /assets, return as is
    if (imagePath.startsWith('/assets/')) {
      return imagePath;
    }
    // If path starts with /media, it's a backend media path (only if API URL exists)
    if (imagePath.startsWith('/media/') && environment.apiUrl) {
      return `${environment.apiUrl}${imagePath}`;
    }
    // Otherwise, treat as assets path
    return '/assets/images/' + imagePath.split('/').pop();
  }

  showPackageDetails(packageItem: Package) {
    this.router.navigate(['/user/packages', packageItem.id]);
  }

  setTab(tab: 'package' | 'hotel' | 'flight') {
    this.selectedTab = tab;
  }

  performSearch() {
    switch (this.selectedTab) {
      case 'package':
        // Update URL with search parameters
        this.router.navigate([], {
          queryParams: { 
            departure: this.packageDeparture, 
            date: this.packageDate 
          },
          queryParamsHandling: 'merge'
        });
        console.log('Package search triggered with departure:', this.packageDeparture, 'and date:', this.packageDate);
        break;
      case 'hotel':
        this.router.navigate(['/user/hotels'], { 
          queryParams: { 
            city: this.hotelCity, 
            date: this.hotelDate 
          } 
        });
        break;
      case 'flight':
        this.router.navigate(['/user/flights'], { 
          queryParams: { 
            from: this.flightFrom, 
            to: this.flightTo, 
            date: this.flightDate 
          } 
        });
        break;
    }
  }
} 