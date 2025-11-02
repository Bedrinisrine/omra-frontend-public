import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelFormComponent } from './hotel-form/hotel-form.component';
import { HotelAdminGuard } from '../../../guards/hotel-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: HotelListComponent,
    canActivate: [HotelAdminGuard]
  },
  {
    path: 'add',
    component: HotelFormComponent,
    canActivate: [HotelAdminGuard]
  },
  {
    path: 'edit/:id',
    component: HotelFormComponent,
    canActivate: [HotelAdminGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HotelListComponent,
    HotelFormComponent
  ]
})
export class HotelsModule { }
