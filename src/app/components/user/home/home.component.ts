import { Component, ViewChild, ElementRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ClientFeedbackService } from '../../../services/client-feedback.service';
import { StaticDataService } from '../../../services/static-data.service';

interface Package {
  id: number;
  nom_pak: string;
  prix: string;
  date_debut: string;
  date_fin: string;
  ville_depart: string;
  qte_package: number;
  images: { image: string }[];
  agence?: { 
    id: number;
    nomagence: string;
    logo_agence?: string;
    adr_agence?: string;
    tel?: number;
  };
}

interface Hotel {
  id: number;
  nom_hotels: string;
  prix: number;
  prix_agoda: number;
  prix_expedia: number;
  prix_booking: number;
  adresse: string;
  ville_arr: string;
  nbr_etoile: number;
  nbr_nuit: number;
  images: { image: string }[];
  collaborators: string[];
  localisation: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class UserHomeComponent implements OnInit {
  selectedTab: 'package' | 'hotel' | 'flight' = 'package';

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

  services = [
    {
      icon: 'search',
      title: 'Faciliter la recherche',
      desc: 'Pour des vendeurs sélectionnés, réservez en quelques clics seulement.'
    },
    {
      icon: 'box',
      title: 'Trouver un forfait et des options adaptées au budget',
      desc: 'Pour des vendeurs sélectionnés, réservez en quelques clics seulement.'
    },
    {
      icon: 'kaaba',
      title: 'Une expérience Omra différente',
      desc: 'Pour des vendeurs sélectionnés, réservez en quelques clics seulement.'
    },
    {
      icon: 'calendar-check',
      title: 'Réservation simplifiée',
      desc: 'Pour des vendeurs sélectionnés, réservez en quelques clics seulement.'
    },
    {
      icon: 'shield-alt',
      title: 'Réserver une Omra sûre et sécurisée',
      desc: 'Pour des vendeurs sélectionnés, réservez en quelques clics seulement.'
    }
  ];
  activeServiceIndex = 0;
  cardsPerView = 3;
  hoveredServiceIndex: number | null = null;

  packages: Package[] = [];
  hotels: Hotel[] = [];
  error: string = '';
  loading: boolean = false;
  private isBrowser: boolean;

  // Add tags in French
  packageTags = [
    'Omra Août 2025',
    'Omra Sept 2025',
    'Omra Ramadan 2025'
  ];
  selectedTag: string = '';

  // Sacred Destinations Section
  destinations = [
    {
      key: 'makkah',
      title: 'La Mecque (Makkah)',
      image: 'assets/images/makkah.jpg',
      description: `La Mecque est la ville la plus sacrée de l'islam. Elle abrite la Kaaba, située dans la mosquée Masjid al-Haram, vers laquelle les musulmans du monde entier se tournent pour prier. Chaque année, des millions de pèlerins viennent à La Mecque pour accomplir le Hajj et la Omra, des rites spirituels majeurs. La ville est également connue pour son histoire riche et son importance religieuse inégalée.`
    },
    {
      key: 'medina',
      title: 'Médine (Al-Madinah al-Munawwarah)',
      image: 'assets/images/madina almunawwarah.jpg',
      description: `Médine est la deuxième ville la plus sacrée de l'islam. Elle abrite la Mosquée du Prophète (Masjid an-Nabawi), où repose le Prophète Muhammad (paix et bénédictions sur lui). Médine est un centre spirituel et historique, accueillant chaque année des millions de visiteurs venus se recueillir et découvrir les sites religieux et culturels de la ville.`
    }
  ];
  currentDestinationIndex = 0;

  clientFeedbacks: any[] = [];

  feedbackFormData = {
    name: '',
    job_title: '',
    feedback: '',
    rating: 0,
    photo: null as File | null
  };
  feedbackSubmitting = false;
  feedbackSuccess = false;
  feedbackError = false;

  showCommentForm = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private feedbackService: ClientFeedbackService,
    private staticDataService: StaticDataService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadPackages();
      this.loadHotels();
      this.loadClientFeedbacks();
    }
  }

  loadPackages() {
    if (!this.isBrowser) return;
    this.loading = true;
    const url = `${environment.apiUrl}/hotels/package/`;
    this.http.get<Package[]>(url).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.packages = data;
        } else {
          // Use static data if API returns empty
          this.packages = this.staticDataService.getStaticPackages() as Package[];
        }
        this.loading = false;
      },
      error: (error) => {
        // Use static data when API fails (for demo purposes)
        console.log('API unavailable, using static data for demonstration');
        this.packages = this.staticDataService.getStaticPackages() as Package[];
        this.loading = false;
      }
    });
  }

  loadHotels() {
    if (!this.isBrowser) return;
    this.loading = true;
    const url = `${environment.apiUrl}/hotels/hotels/`;
    this.http.get<Hotel[]>(url).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.hotels = data;
        } else {
          // Use static data if API returns empty
          this.hotels = this.staticDataService.getStaticHotels() as Hotel[];
        }
        this.loading = false;
      },
      error: (error) => {
        // Use static data when API fails (for demo purposes)
        console.log('API unavailable, using static data for demonstration');
        this.hotels = this.staticDataService.getStaticHotels() as Hotel[];
        this.loading = false;
      }
    });
  }

  loadClientFeedbacks() {
    this.feedbackService.getFeedback().subscribe(data => {
      this.clientFeedbacks = data;
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath || imagePath.trim() === '') {
      return '/assets/images/kaaba.jpg';
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Normalize the path - remove leading slash if present, then add it
    let normalizedPath = imagePath.trim();
    
    // If path starts with assets/, add leading slash
    if (normalizedPath.startsWith('assets/')) {
      return '/' + normalizedPath;
    }
    
    // If path starts with /assets/, return as is
    if (normalizedPath.startsWith('/assets/')) {
      return normalizedPath;
    }
    
    // If path starts with /media/, it's a backend media path (only if API URL exists)
    if (normalizedPath.startsWith('/media/')) {
      if (environment.apiUrl) {
        return `${environment.apiUrl}${normalizedPath}`;
      } else {
        // If no API URL, use fallback image
        return '/assets/images/kaaba.jpg';
      }
    }
    
    // If it's just a filename, assume it's in assets/images
    if (!normalizedPath.includes('/')) {
      return '/assets/images/' + normalizedPath;
    }
    
    // Otherwise, try to treat as assets path
    return '/assets/images/' + normalizedPath.split('/').pop();
  }

  showPackageDetails(packageItem: Package) {
    this.router.navigate(['/user/packages', packageItem.id]);
  }

  showHotelDetails(hotel: Hotel) {
    this.router.navigate(['/user/hotels', hotel.id]);
  }

  @ViewChild('servicesRow', { static: false }) servicesRow!: ElementRef;
  @ViewChild('packagesRow', { static: false }) packagesRow!: ElementRef;
  @ViewChild('hotelsRow', { static: false }) hotelsRow!: ElementRef;
  @ViewChild('logosRow', { static: false }) logosRow!: ElementRef;
  @ViewChild('commentsRow', { static: false }) commentsRow!: ElementRef;

  setTab(tab: 'package' | 'hotel' | 'flight') {
    this.selectedTab = tab;
  }

  setActiveService(idx: number) {
    this.activeServiceIndex = idx;
  }

  get visibleServices() {
    return this.services.slice(this.activeServiceIndex, this.activeServiceIndex + this.cardsPerView);
  }

  nextService() {
    if (this.activeServiceIndex + this.cardsPerView < this.services.length) {
      this.activeServiceIndex++;
    }
  }

  prevService() {
    if (this.activeServiceIndex > 0) {
      this.activeServiceIndex--;
    }
  }

  scrollServices(direction: 'left' | 'right') {
    const row = this.servicesRow?.nativeElement;
    if (!row) return;
    const scrollAmount = 260; // width + margin
    if (direction === 'left') {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      if (this.activeServiceIndex > 0) this.activeServiceIndex--;
    } else {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (this.activeServiceIndex < this.services.length - 1) this.activeServiceIndex++;
    }
  }

  scrollPackages(direction: 'left' | 'right') {
    const row = this.packagesRow?.nativeElement;
    if (!row) return;
    const scrollAmount = 340;
    if (direction === 'left') {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollHotels(direction: 'left' | 'right') {
    const row = this.hotelsRow?.nativeElement;
    if (!row) return;
    const scrollAmount = 340;
    if (direction === 'left') {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollLogos(direction: 'left' | 'right') {
    const row = this.logosRow?.nativeElement;
    if (!row) return;
    const scrollAmount = 200;
    if (direction === 'left') {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollComments(direction: 'left' | 'right') {
    const row = this.commentsRow?.nativeElement;
    if (!row) return;
    const scrollAmount = 340; // Adjust as needed for comments carousel
    if (direction === 'left') {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  goToPackages() {
    this.router.navigate(['/user/packages']);
  }

  goToHotels() {
    this.router.navigate(['/user/hotels']);
  }

  get filteredPackages() {
    if (!this.selectedTag) return this.packages;
    return this.packages.filter(pkg => pkg.nom_pak && pkg.nom_pak.includes(this.selectedTag));
  }

  setTag(tag: string) {
    this.selectedTag = tag;
  }

  clearTag() {
    this.selectedTag = '';
  }

  get currentDestination() {
    return this.destinations[this.currentDestinationIndex];
  }

  nextDestination() {
    this.currentDestinationIndex = (this.currentDestinationIndex + 1) % this.destinations.length;
  }

  prevDestination() {
    this.currentDestinationIndex = (this.currentDestinationIndex - 1 + this.destinations.length) % this.destinations.length;
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.feedbackFormData.photo = file;
    }
  }

  submitFeedback() {
    if (!this.feedbackFormData.name || !this.feedbackFormData.feedback || !this.feedbackFormData.rating) {
      this.feedbackError = true;
      this.feedbackSuccess = false;
      return;
    }
    this.feedbackSubmitting = true;
    this.feedbackError = false;
    this.feedbackSuccess = false;
    const formData = new FormData();
    formData.append('name', this.feedbackFormData.name);
    formData.append('job_title', this.feedbackFormData.job_title);
    formData.append('feedback', this.feedbackFormData.feedback);
    formData.append('rating', this.feedbackFormData.rating.toString());
    if (this.feedbackFormData.photo) {
      formData.append('photo', this.feedbackFormData.photo);
    }
    this.feedbackService.submitFeedback(formData).subscribe({
      next: () => {
        this.feedbackSubmitting = false;
        this.feedbackSuccess = true;
        this.feedbackFormData = { name: '', job_title: '', feedback: '', rating: 0, photo: null };
      },
      error: () => {
        this.feedbackSubmitting = false;
        this.feedbackError = true;
      }
    });
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  // Add search methods as needed
  performSearch() {
    switch (this.selectedTab) {
      case 'package':
        console.log('Package search triggered with departure:', this.packageDeparture, 'and date:', this.packageDate);
        this.router.navigate(['/user/packages'], {
          queryParams: { 
            departure: this.packageDeparture, 
            date: this.packageDate 
          }
        });
        break;
      case 'hotel':
        console.log('Hotel search triggered with city:', this.hotelCity, 'and date:', this.hotelDate);
        this.router.navigate(['/user/hotels'], {
          queryParams: { 
            city: this.hotelCity, 
            date: this.hotelDate 
          }
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
}
