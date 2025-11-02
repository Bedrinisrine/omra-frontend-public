import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HotelViewComponent } from './hotel-view/hotel-view.component';

const routes: Routes = [
  {
    path: '',
    component: HotelViewComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HotelsModule { } 