import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

interface Agency {
  id?: number;
  nomagence: string;
  logo_agence?: string;
  adr_agence?: string;
  tel?: number;
}

@Component({
  selector: 'app-agency-form',
  templateUrl: './agency-form.component.html',
  styleUrls: ['./agency-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AgencyFormComponent implements OnInit {
  agencyForm: FormGroup;
  agencyId: number | null = null;
  isEdit = false;
  loading = false;
  error = '';
  successMessage = '';
  selectedFile: File | null = null;
  existingLogoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.agencyForm = this.fb.group({
      nomagence: ['', Validators.required],
      adr_agence: [''],
      tel: [''],
      logo_agence: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.agencyId = +params['id'];
        this.isEdit = true;
        this.loadAgency(this.agencyId);
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadAgency(id: number): void {
    this.loading = true;
    this.http.get<Agency>(`${environment.apiUrl}/hotels/agencies/${id}/`, { 
      headers: this.getAuthHeaders() 
    }).subscribe({
      next: (data) => {
        this.agencyForm.patchValue({
          nomagence: data.nomagence,
          adr_agence: data.adr_agence || '',
          tel: data.tel || ''
        });
        if (data.logo_agence) {
          this.existingLogoUrl = this.getImageUrl(data.logo_agence);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading agency:', error);
        this.error = 'Failed to load agency';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.existingLogoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.agencyForm.valid) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      const formData = new FormData();
      
      // Append form data
      Object.keys(this.agencyForm.value).forEach(key => {
        if (key !== 'logo_agence' && this.agencyForm.value[key] !== null && this.agencyForm.value[key] !== '') {
          formData.append(key, this.agencyForm.value[key]);
        }
      });

      // Append logo file if selected
      if (this.selectedFile) {
        formData.append('logo_agence', this.selectedFile);
      }

      if (this.isEdit && this.agencyId !== null) {
        // Update existing agency
        this.http.put<Agency>(`${environment.apiUrl}/hotels/agencies/${this.agencyId}/`, formData, { 
          headers: this.getAuthHeaders() 
        }).subscribe({
          next: () => {
            this.successMessage = 'Agency updated successfully!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/admin/agencies']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating agency:', error);
            this.error = 'Failed to update agency';
            this.loading = false;
          }
        });
      } else {
        // Create new agency
        this.http.post<Agency>(`${environment.apiUrl}/hotels/agencies/`, formData, { 
          headers: this.getAuthHeaders() 
        }).subscribe({
          next: () => {
            this.successMessage = 'Agency created successfully!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/admin/agencies']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating agency:', error);
            this.error = 'Failed to create agency';
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
    return `${environment.apiUrl}${imagePath}`;
  }

  removeLogo(): void {
    this.selectedFile = null;
    this.existingLogoUrl = null;
    this.agencyForm.patchValue({ logo_agence: null });
  }
} 