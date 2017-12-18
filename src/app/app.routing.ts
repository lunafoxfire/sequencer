import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { AppPageComponent } from './app-page/app-page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: 'app',
    component: AppPageComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
