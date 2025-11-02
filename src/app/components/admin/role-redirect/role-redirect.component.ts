import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-role-redirect",
  template: `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Redirecting to your dashboard...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    p {
      margin: 0;
      font-size: 1.1rem;
    }
  `],
  standalone: true
})
export class RoleRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const currentUserStr = localStorage.getItem("currentUser");
    
    if (!currentUserStr) {
      this.router.navigate(["/login"]);
      return;
    }

    try {
      const user = JSON.parse(currentUserStr);
      const username = user.username;
      
      // Redirect based on username
      if (username === "superadmin") {
        this.router.navigate(["/admin"]);
      } else if (username === "hoteladmin") {
        this.router.navigate(["/admin/hotel-dashboard"]);
      } else if (username === "packageadmin") {
        this.router.navigate(["/admin/package-dashboard"]);
      } else {
        // Default to super admin dashboard for other staff users
        this.router.navigate(["/admin"]);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.router.navigate(["/login"]);
    }
  }
}
