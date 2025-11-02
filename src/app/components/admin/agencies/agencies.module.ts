import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgencyListComponent } from './agency-list/agency-list.component';
import { AgencyFormComponent } from './agency-form/agency-form.component';

const routes: Routes = [
  { path: '', component: AgencyListComponent },
  { path: 'add', component: AgencyFormComponent },
  { path: 'edit/:id', component: AgencyFormComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgencyListComponent,
    AgencyFormComponent
  ]
})
export class AgenciesModule { } 