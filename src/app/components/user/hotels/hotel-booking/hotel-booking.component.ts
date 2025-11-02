import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface Hotel {
  id: number;
  nom_hotels: string;
  ville_arr: string;
  prix: string;
  nbr_etoile: number;
  nbr_nuit: number;
}

@Component({
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class HotelBookingComponent implements OnInit {
  hotel: Hotel | null = null;
  bookingForm: FormGroup;
  isLoading = false;
  error: string = '';
  success: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.bookingForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      rooms: [1, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });
  }

  ngOnInit() {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.loadHotel(parseInt(hotelId));
    }
  }

  loadHotel(id: number) {
    // Load hotel details - you'll need to implement this based on your API
    // For now, we'll use mock data
    this.hotel = {
      id: id,
      nom_hotels: 'Sample Hotel',
      ville_arr: 'Makkah',
      prix: '150',
      nbr_etoile: 4,
      nbr_nuit: 3
    };
  }

  onSubmit() {
    if (this.bookingForm.valid && this.hotel) {
      this.isLoading = true;
      this.error = '';
      
      const bookingData = {
        hotel_id: this.hotel.id,
        check_in: this.bookingForm.value.checkIn,
        check_out: this.bookingForm.value.checkOut,
        guests: this.bookingForm.value.guests,
        rooms: this.bookingForm.value.rooms,
        special_requests: this.bookingForm.value.specialRequests
      };

      // Here you would make the actual booking API call
      // this.http.post(${environment.apiUrl}/hotels/booking/, bookingData).subscribe({
      //   next: (response) => {
      //     this.isLoading = false;
      //     this.success = 'Booking successful!';
      //   },
      //   error: (error) => {
      //     this.isLoading = false;
      //     this.error = 'Booking failed. Please try again.';
      //   }
      // });

      // Mock success for now
      setTimeout(() => {
        this.isLoading = false;
        this.success = 'Booking successful! You will receive a confirmation email shortly.';
      }, 2000);
    }
  }

  goBack() {
    this.router.navigate(['/user/hotels']);
  }
}
