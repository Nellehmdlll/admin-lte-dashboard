import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./type-list/type-list.component').then(m => m.TypeListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./type-form/type-form.component').then(m => m.TypeFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./type-form/type-form.component').then(m => m.TypeFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./type-detail/type-detail.component').then(m => m.TypeDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeModule { }
