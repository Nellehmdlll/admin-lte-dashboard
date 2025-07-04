import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ministere-list/ministere-list.component').then(m => m.MinistereListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./ministere-form/ministere-form.component').then(m => m.MinistereFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./ministere-form/ministere-form.component').then(m => m.MinistereFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./ministere-detail/ministere-detail.component').then(m => m.MinistereDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinistereModule { }
