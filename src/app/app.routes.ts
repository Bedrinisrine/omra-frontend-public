import { Routes } from "@angular/router";
import { LoginComponent } from "./components/auth/login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { AdminDashboardComponent } from "./components/admin/admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./components/user/user-dashboard/user-dashboard.component";
import { UserHomeComponent } from "./components/user/home/home.component";
import { AdminHomeComponent } from "./components/admin/home/home.component";
import { DebugComponent } from "./components/admin/debug/debug.component";
import { RoleRedirectComponent } from "./components/admin/role-redirect/role-redirect.component";
import { HotelAdminDashboardComponent } from "./components/admin/hotel-admin-dashboard/hotel-admin-dashboard.component";
import { PackageAdminDashboardComponent } from "./components/admin/package-admin-dashboard/package-admin-dashboard.component";

// Import the new package components
import { PackageListComponent as UserPackageListComponent } from "./components/user/packages/package-list/package-list.component";
import { PackageViewComponent as UserPackageViewComponent } from "./components/user/packages/package-view/package-view.component";
import { AdminPackageListComponent } from "./components/admin/packages/package-list/package-list.component";
import { PackageFormComponent as AdminPackageFormComponent } from "./components/admin/packages/package-form/package-form.component";
import { FeedbackModerationComponent } from "./components/admin/feedback-moderation/feedback-moderation.component";

// Import agency components
import { AgencyListComponent } from "./components/admin/agencies/agency-list/agency-list.component";
import { AgencyFormComponent } from "./components/admin/agencies/agency-form/agency-form.component";

export const routes: Routes = [
  // Auth routes
  { path: "login", component: LoginComponent },
  
  // Role-based redirect
  { path: "admin-redirect", component: RoleRedirectComponent },
  
  // Test route for debugging
  { path: "test-admin", component: AdminDashboardComponent },
  { path: "debug", component: DebugComponent },
  
  // Super Admin routes - full access
  {
    path: "admin",
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: "", component: AdminHomeComponent },
      { path: "hotels", loadChildren: () => import("./components/admin/hotels/hotels.module").then(m => m.HotelsModule) },
      { path: "agencies", component: AgencyListComponent },
      { path: "agencies/add", component: AgencyFormComponent },
      { path: "agencies/edit/:id", component: AgencyFormComponent },
      { path: "packages", component: AdminPackageListComponent },
      { path: "packages/new", component: AdminPackageFormComponent },
      { path: "packages/edit/:id", component: AdminPackageFormComponent },
      { path: "feedback-moderation", component: FeedbackModerationComponent },
      { path: "debug", component: DebugComponent },
    ]
  },
  
  // Hotel Admin Dashboard
  {
    path: "admin/hotel-dashboard",
    component: HotelAdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  
  // Package Admin Dashboard  
  {
    path: "admin/package-dashboard",
    component: PackageAdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  
  // User routes - public
  {
    path: "user",
    component: UserDashboardComponent,
    children: [
      { path: "", component: UserHomeComponent },
      { path: "hotels", loadChildren: () => import("./components/user/hotels/hotels.module").then(m => m.HotelsModule) },
      { path: "packages", component: UserPackageListComponent },
      { path: "packages/:id", component: UserPackageViewComponent },
    ]
  },
  
  // Default route - redirect to user home
  { path: "", redirectTo: "user", pathMatch: "full" },
  
  // Catch all route - redirect to user home
  { path: "**", redirectTo: "user" }
];
