import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageListComponent } from './package-list/package-list.component';
import { PackageFormComponent } from './package-form/package-form.component';
import { PackageAdminGuard } from '../../../guards/package-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: PackageListComponent,
    canActivate: [PackageAdminGuard]
  },
  {
    path: 'add',
    component: PackageFormComponent,
    canActivate: [PackageAdminGuard]
  },
  {
    path: 'edit/:id',
    component: PackageFormComponent,
    canActivate: [PackageAdminGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    PackageListComponent,
    PackageFormComponent
  ]
})
export class PackagesModule { }
