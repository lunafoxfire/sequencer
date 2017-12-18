import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { SequencerPageComponent } from './sequencer-page/sequencer-page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: 'sequencer',
    component: SequencerPageComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
