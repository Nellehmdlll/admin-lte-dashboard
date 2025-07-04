import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DemandeFormComponent } from './pages/demande-form/demande-form.component';
import { DemandesListComponent } from './pages/demandes-list/demandes-list.component';
import { BordereauReceptionComponent } from './pages/bordereau-reception/bordereau-reception.component';
import { GestionBordereauComponent } from './pages/gestion-bordereau/gestion-bordereau.component';
import { StockComponent } from './pages/stock/stock.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';
import { MarqueListComponent } from './pages/settings/marque/marque-list/marque-list.component';
import { MarqueFormComponent } from './pages/settings/marque/marque-form/marque-form.component';
import { MarqueDetailComponent } from './pages/settings/marque/marque-detail/marque-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Tableau de bord utilisateur standard
      { path: '', component: DashboardComponent },

      // Tableau de bord administrateur
      { path: 'admin/dashboard', component: AdminDashboardComponent },

      // Autres routes
      { path: 'users',
        children: [
          { path: '', component: UsersComponent },
          { path: 'new', component: UserFormComponent },
          { path: 'edit/:id', component: UserFormComponent },
          { path: ':id', component: UserFormComponent },
          { path: 'view/:id', component: UserDetailComponent },
        ]
      },
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
      { path: 'bordereau-reception', component: BordereauReceptionComponent },
      {
        path: 'bordereaux',
        children: [
          { path: '', component: GestionBordereauComponent },
          { path: ':id', component: GestionBordereauComponent }
        ]
      },

      // Gestion des stocks
      { path: 'stock', component: StockComponent },

      // Redirection pour l'ancien tableau de bord
      { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
      
      { path: 'settings/marque',
        children: [
          { path: '', component: MarqueListComponent },
          { path: 'new', component: MarqueFormComponent },
          { path: 'edit/:id', component: MarqueFormComponent },
          { path: ':id', component: MarqueFormComponent },
          { path: 'view/:id', component: MarqueDetailComponent },
        ]
      },
    ]
  }
];
