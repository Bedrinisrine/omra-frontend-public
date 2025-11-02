import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: "root" })
export class HotelAdminGuard implements CanActivate {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  canActivate(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");
    
    if (!token || !currentUser) {
      this.router.navigate(["/login"]);
      return false;
    }

    try {
      const user = JSON.parse(currentUser);
      const hasHotelAccess = (user.username === "superadmin" || user.username === "hoteladmin") && user.is_staff;
      
      if (!hasHotelAccess) {
        this.router.navigate(["/login"]);
        return false;
      }
      
      return true;
    } catch {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
