import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-package-admin-dashboard",
  templateUrl: "./package-admin-dashboard.component.html",
  styleUrls: ["./package-admin-dashboard.component.css"],
  standalone: true
})
export class PackageAdminDashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr) {
      this.currentUser = JSON.parse(currentUserStr);
    }
  }

  navigateToPackages() {
    this.router.navigate(["/admin/packages"]);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    this.router.navigate(["/login"]);
  }
}
