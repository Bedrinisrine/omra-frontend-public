import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-hotel-admin-dashboard",
  templateUrl: "./hotel-admin-dashboard.component.html",
  styleUrls: ["./hotel-admin-dashboard.component.css"],
  standalone: true
})
export class HotelAdminDashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr) {
      this.currentUser = JSON.parse(currentUserStr);
    }
  }

  navigateToHotels() {
    this.router.navigate(["/admin/hotels"]);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    this.router.navigate(["/login"]);
  }
}
