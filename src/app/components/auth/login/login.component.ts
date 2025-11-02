import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  success: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('LoginComponent initialized');
    // Check for registration success message
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.success = 'Registration successful! Please login.';
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const { username, password } = this.loginForm.value;
      console.log('Attempting login with username:', username);
      
      this.authService.login(username, password).subscribe({
        next: (user) => {
          this.isLoading = false;
          console.log('LoginComponent: Login successful, user data:', user);
          console.log('LoginComponent: is_staff value:', user.is_staff);
          console.log('LoginComponent: typeof is_staff:', typeof user.is_staff);
          
          // The backend returns is_staff, which indicates admin status
          // Store this in localStorage under the key 'isAdmin'
          localStorage.setItem('isAdmin', user.is_staff.toString());
          console.log('LoginComponent: Admin status (from is_staff) set to:', user.is_staff);
          console.log('LoginComponent: localStorage isAdmin set to:', localStorage.getItem('isAdmin'));
          
          if (user.is_staff) { // Use is_staff here
            console.log('LoginComponent: User is admin, redirecting to admin dashboard');
            this.router.navigate(['/admin']);
          } else {
            console.log('LoginComponent: User is not admin, redirecting to user dashboard');
            this.router.navigate(['/user']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('LoginComponent: Login error:', error);
          
          if (error.status === 401) {
            this.error = 'Invalid username or password';
          } else if (error.error && error.error.detail) {
            this.error = error.error.detail;
          } else if (error.status === 0) {
            this.error = 'Unable to connect to the server. Please check if the backend is running.';
          } else {
            this.error = 'An error occurred during login. Please try again.';
          }
        }
      });
    } else {
      console.log('Form is invalid:', this.loginForm.errors);
    }
  }
} 