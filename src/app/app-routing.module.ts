import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/user/shared/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/user/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'user/packages',
        loadChildren: () => import('./components/user/packages/packages.module').then(m => m.PackagesModule)
      },
      {
        path: 'user/hotels',
        loadChildren: () => import('./components/user/hotels/hotels.module').then(m => m.HotelsModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./components/user/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'discover',
        loadChildren: () => import('./components/user/discover/discover.module').then(m => m.DiscoverModule)
      },
      {
        path: 'design',
        loadChildren: () => import('./components/user/design/design.module').then(m => m.DesignModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('./components/user/contact/contact.module').then(m => m.ContactModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 