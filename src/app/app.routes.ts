import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DemandeFormComponent } from './pages/demande-form/demande-form.component';
import { DemandesListComponent } from './pages/demandes-list/demandes-list.component';
import { BordereauReceptionComponent } from './pages/bordereau-reception/bordereau-reception.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'demande',
        children: [
          { path: 'new', component: DemandeFormComponent },
          { path: 'edit/:id', component: DemandeFormComponent },
          { path: ':id', component: DemandeFormComponent },
          { path: 'view/:id', component: DemandeFormComponent },

        ]
      },
      { path: 'demandes', component: DemandesListComponent },
      { path: 'bordereau-reception', component: BordereauReceptionComponent }
    ]
  }
];
