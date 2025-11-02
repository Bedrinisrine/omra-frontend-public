import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StaticDataService } from '../../../../services/static-data.service';

interface Hotel {
  id: number;
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
  collaborator: string;
  images: { image: string }[];
  package_name?: string;
}

@Component({
  selector: 'app-hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrls: ['./hotel-view.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class HotelViewComponent implements OnInit {
  hotels: Hotel[] = [];
  selectedHotel: Hotel | null = null;
  currentImageIndex: number = 0;
  error: string = '';
  loading: boolean = false;
  private isBrowser: boolean;

  // Add properties from home.component.ts for the search bar
  selectedTab: 'package' | 'hotel' | 'flight' = 'hotel'; // Default to hotel tab
  searchTriggered: boolean = false; // New flag to control initial display

  // Form fields for each tab
  // Package
  packageDeparture: string = '';
  packageDate: string = '';

  // Hotel
  hotelCity: 'Makkah' | 'Madinah' = 'Makkah';
  hotelDate: string = '';

  // Flight
  flightFrom: string = '';
  flightTo: string = '';
  flightDate: string = '';

  // Properties for filters
  hotelNameFilter: string = '';
  priceRangeFilters: string[] = [];
  starRatingFilters: string[] = [];

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
      this.loadHotels();
      this.handleQueryParams();
    }
  }

  private handleQueryParams() {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    const date = urlParams.get('date');
    
    if (city) {
      this.hotelCity = city as 'Makkah' | 'Madinah';
      this.selectedTab = 'hotel';
      this.searchTriggered = true;
    }
    
    if (date) {
      this.hotelDate = date;
      this.searchTriggered = true;
    }
  }

  loadHotels() {
    if (!this.isBrowser) return;
    
    this.loading = true;
    const url = `${environment.apiUrl}/hotels/hotels/`;
    console.log('Loading hotels from:', url);
    
    this.http.get<Hotel[]>(url).subscribe({
      next: (data) => {
        console.log('Hotels loaded:', data);
        if (data && data.length > 0) {
          this.hotels = data;
        } else {
          // Use static data if API returns empty
          this.hotels = this.staticDataService.getStaticHotels() as Hotel[];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        console.log('API unavailable, using static data for demonstration');
        // Use static data when API fails (for demo purposes)
        this.hotels = this.staticDataService.getStaticHotels() as Hotel[];
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

  showHotelDetails(hotel: Hotel) {
    this.selectedHotel = hotel;
    this.currentImageIndex = 0;
  }

  closeHotelDetails() {
    this.selectedHotel = null;
  }

  nextImage() {
    if (this.selectedHotel && this.currentImageIndex < this.selectedHotel.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage() {
    if (this.selectedHotel && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  // Add methods from home.component.ts for search bar functionality
  setTab(tab: 'package' | 'hotel' | 'flight') {
    this.selectedTab = tab;
    this.searchTriggered = false; // Reset searchTriggered when tab changes
  }

  performSearch() {
    switch (this.selectedTab) {
      case 'package':
        this.searchTriggered = true;
        console.log('Package search triggered with departure:', this.packageDeparture, 'and date:', this.packageDate);
        // Navigate to packages page with search parameters
        this.router.navigate(['/user/packages'], {
          queryParams: { 
            departure: this.packageDeparture, 
            date: this.packageDate 
          }
        });
        break;
      case 'hotel':
        this.searchTriggered = true;
        console.log('Hotel search triggered with city:', this.hotelCity, 'and date:', this.hotelDate);
        // Update URL with search parameters
        this.router.navigate([], {
          queryParams: { 
            city: this.hotelCity, 
            date: this.hotelDate 
          },
          queryParamsHandling: 'merge'
        });
        break;
      case 'flight':
        console.log('Flight search triggered with from:', this.flightFrom, 'to:', this.flightTo, 'date:', this.flightDate);
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

  // Method to filter hotels based on selected criteria
  get filteredHotels(): Hotel[] {
    let filtered = this.hotels;

    // If on hotel tab and search not triggered, show all hotels
    if (this.selectedTab === 'hotel' && !this.searchTriggered) {
      return this.hotels;
    }

    // If on package tab and search not triggered, show all hotels
    if (this.selectedTab === 'package' && !this.searchTriggered) {
      return this.hotels; // Display all hotels by default for package tab
    }

    // Filter by hotel name (applies to hotel and package tabs if searchTriggered is true)
    if (this.selectedTab === 'hotel' && this.hotelNameFilter) {
      filtered = filtered.filter(hotel =>
        hotel.nom_hotels.toLowerCase().includes(this.hotelNameFilter.toLowerCase())
      );
    }

    // Filter by price range (applies to hotel and package tabs if searchTriggered is true)
    if (this.priceRangeFilters && this.priceRangeFilters.length > 0) {
      filtered = filtered.filter(hotel => {
        const price = hotel.prix; // Use the base price for range filtering
        return this.priceRangeFilters.some(range => {
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
      });
    }

    // Filter by star rating (applies to hotel and package tabs if searchTriggered is true)
    if (this.starRatingFilters && this.starRatingFilters.length > 0) {
      filtered = filtered.filter(hotel => {
        return this.starRatingFilters.some(rating => hotel.nbr_etoile === Number(rating));
      });
    }

    // Apply hotel-specific filters if the hotel tab is active and search is triggered
    if (this.selectedTab === 'hotel' && this.searchTriggered) {
      // Filter by city
      if (this.hotelCity) {
        filtered = filtered.filter(hotel => hotel.ville_arr === this.hotelCity);
      }

      // Filter by date
      if (this.hotelDate) {
        const selectedDate = new Date(this.hotelDate);
        filtered = filtered.filter(hotel => {
          const hotelStartDate = new Date(hotel.date_debut);
          const hotelEndDate = new Date(hotel.date_fin);
          return selectedDate >= hotelStartDate && selectedDate <= hotelEndDate;
        });
      }
    }

    // Apply package-specific filters if the package tab is active and search is triggered
    if (this.selectedTab === 'package' && this.searchTriggered) {
      // Filter by package departure city
      if (this.packageDeparture) {
        // Assuming packageDeparture maps to hotel's arrival city (ville_arr)
        filtered = filtered.filter(hotel => hotel.ville_arr === this.packageDeparture);
      }

      // Filter by package date
      if (this.packageDate) {
        const selectedDate = new Date(this.packageDate);
        filtered = filtered.filter(hotel => {
          const hotelStartDate = new Date(hotel.date_debut);
          const hotelEndDate = new Date(hotel.date_fin);
          // Check if the selected package date falls within the hotel's date range
          return selectedDate >= hotelStartDate && selectedDate <= hotelEndDate;
        });
      }
    }

    return filtered;
  }

  // Methods for price range filter
  isPriceRangeSelected(range: string): boolean {
    return this.priceRangeFilters.includes(range);
  }

  togglePriceRange(range: string): void {
    const index = this.priceRangeFilters.indexOf(range);
    if (index === -1) {
      this.priceRangeFilters.push(range);
    } else {
      this.priceRangeFilters.splice(index, 1);
    }
  }

  // Methods for star rating filter
  isStarRatingSelected(rating: string): boolean {
    return this.starRatingFilters.includes(rating);
  }

  toggleStarRating(rating: string): void {
    const index = this.starRatingFilters.indexOf(rating);
    if (index === -1) {
      this.starRatingFilters.push(rating);
    } else {
      this.starRatingFilters.splice(index, 1);
    }
  }

  // Booking requires authentication; redirect to login if missing
  checkAuthAndBook(hotel: Hotel) {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('bookingRedirectUrl', '/user/hotels');
      this.router.navigate(['/login']);
      return;
    }
    alert('Booking functionality will be implemented here. Hotel: ' + hotel.nom_hotels);
  }
}
