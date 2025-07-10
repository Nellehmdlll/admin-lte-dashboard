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
import { MinistereListComponent } from './pages/settings/ministere/ministere-list/ministere-list.component';
import { MinistereFormComponent } from './pages/settings/ministere/ministere-form/ministere-form.component';
import { MinistereDetailComponent } from './pages/settings/ministere/ministere-detail/ministere-detail.component';
import { TypeListComponent } from './pages/settings/type/type-list/type-list.component';
import { TypeFormComponent } from './pages/settings/type/type-form/type-form.component';
import { TypeDetailComponent } from './pages/settings/type/type-detail/type-detail.component';
import { Login } from './pages/login/login.component';
import { Register } from './pages/register/register.component';
import { ChoixType } from './pages/choix-type/choix-type.component';
import { PersonnePhysique } from './pages/personne-physique/personne-physique.component';
import { PersonneMorale } from './pages/personne-morale/personne-morale.component';
import { Dashboard } from './pages/dashboard/dashboard.component';
import { DemandeInfo } from './pages/demande-info/demande-info.component';
import { authGuard } from './guards/auth.guard';

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

      {
        path: 'settings/ministere',
        loadChildren: () => import('./pages/settings/ministere/ministere.module').then(m => m.MinistereModule)
      },
      { path: 'settings/marque',
        children: [
          { path: '', component: MarqueListComponent },
          { path: 'new', component: MarqueFormComponent },
          { path: 'edit/:id', component: MarqueFormComponent },
          { path: ':id', component: MarqueFormComponent },
          { path: 'view/:id', component: MarqueDetailComponent },
        ]
      },
      { path: 'settings/ministere',
        children: [
          { path: '', component: MinistereListComponent },
          { path: 'new', component: MinistereFormComponent },
          { path: 'edit/:id', component: MinistereFormComponent },
          { path: ':id', component: MinistereFormComponent },
          { path: 'view/:id', component: MinistereDetailComponent },
        ]
      },
      { path: 'settings/type',
        children: [
          { path: '', component: TypeListComponent },
          { path: 'new', component: TypeFormComponent },
          { path: 'edit/:id', component: TypeFormComponent },
          { path: ':id', component: TypeFormComponent },
          { path: 'view/:id', component: TypeDetailComponent },
        ]
      },

      // login et déconnexion
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: Login },
        { path: 'register', component: Register },
        { path: 'choix-type', component: ChoixType },
        { path: 'personne-physique', component: PersonnePhysique },
        { path: 'personne-morale', component: PersonneMorale },
        { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
        { path: 'demande/:id', component: DemandeInfo, canActivate: [authGuard] }
    ]
  }
];
