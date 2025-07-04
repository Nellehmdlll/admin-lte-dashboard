import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarqueListComponent } from './marque-list/marque-list.component';
import { MarqueFormComponent } from './marque-form/marque-form.component';
import { MarqueDetailComponent } from './marque-detail/marque-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MarqueListComponent,
    data: {
      title: 'Marques de moto',
      breadcrumb: [
        { label: 'Paramètres', url: '/settings' },
        { label: 'Marques de moto', url: '' }
      ]
    }
  },
  {
    path: 'nouveau',
    component: MarqueFormComponent,
    data: {
      title: 'Nouvelle marque',
      breadcrumb: [
        { label: 'Paramètres', url: '/settings' },
        { label: 'Marques de moto', url: '/settings/marque-moto' },
        { label: 'Nouvelle marque', url: '' }
      ]
    }
  },
  {
    path: ':id',
    component: MarqueDetailComponent,
    data: {
      title: 'Détails de la marque',
      breadcrumb: [
        { label: 'Paramètres', url: '/settings' },
        { label: 'Marques de moto', url: '/settings/marque-moto' },
        { label: 'Détails', url: '' }
      ]
    }
  },
  {
    path: ':id/modifier',
    component: MarqueFormComponent,
    data: {
      title: 'Modifier la marque',
      breadcrumb: [
        { label: 'Paramètres', url: '/settings' },
        { label: 'Marques de moto', url: '/settings/marque-moto' },
        { label: 'Modifier', url: '' }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarqueRoutingModule { }
