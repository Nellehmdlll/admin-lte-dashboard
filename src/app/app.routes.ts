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
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ChoixType } from './pages/choix-type/choix-type';
import { PersonnePhysique } from './pages/choix-type/personne-physique/personne-physique';
import { PersonneMorale } from './pages/choix-type/personne-morale/personne-morale';
import { authGuard } from './services/auth.guard';
import { roleGuard } from './services/role.guard';
import { UnauthorizedComponentComponent } from './unauthorized-component/unauthorized-component.component';
import { SuperDashboard } from './super-dashboard/super-dashboard';




export const routes: Routes = [
  // Redirection initiale vers login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Choix type de personne
  { path: 'choix-type', component: ChoixType },
  { path: 'personne-physique', component: PersonnePhysique },
  { path: 'personne-morale', component: PersonneMorale },

  // Unauthorized
  { path: 'unauthorized', component: UnauthorizedComponentComponent },

  // Layout sécurisé (connecté)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Tableau de bord utilisateur
      { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard(['utilisateur'])] },

      // Tableau de bord administrateur
      { path: 'admin/dashboard', component: AdminDashboardComponent },

      { path: 'administrateur', component: SuperDashboard },

      // Users (superadmin)
      {
        path: 'users', canActivate: [roleGuard(['superadmin'])],
        children: [
          { path: '', component: UsersComponent },
          { path: 'new', component: UserFormComponent },
          { path: 'edit/:id', component: UserFormComponent },
          { path: ':id', component: UserFormComponent },
          { path: 'view/:id', component: UserDetailComponent },
        ]
      },

      // Paramètres globaux
      { path: 'settings', component: SettingsComponent },

      // Paramètres : ministère (lazy load OK)
      {
        path: 'settings/ministere',
        loadChildren: () => import('./pages/settings/ministere/ministere.module').then(m => m.MinistereModule)
      },

      // Paramètres : marque
      {
        path: 'settings/marque',
        children: [
          { path: '', component: MarqueListComponent },
          { path: 'new', component: MarqueFormComponent },
          { path: 'edit/:id', component: MarqueFormComponent },
          { path: ':id', component: MarqueFormComponent },
          { path: 'view/:id', component: MarqueDetailComponent },
        ]
      },

      // Paramètres : type
      {
        path: 'settings/type',
        children: [
          { path: '', component: TypeListComponent },
          { path: 'new', component: TypeFormComponent },
          { path: 'edit/:id', component: TypeFormComponent },
          { path: ':id', component: TypeFormComponent },
          { path: 'view/:id', component: TypeDetailComponent },
        ]
      },

      // Demandes utilisateur
      {
        path: 'demande',
        canActivate: [roleGuard(['utilisateur'])],
        children: [
          { path: 'new', component: DemandeFormComponent ,canActivate: [roleGuard(['utilisateur'])]},
          { path: 'edit/:id', component: DemandeFormComponent ,canActivate: [roleGuard(['utilisateur'])] },
          { path: ':id', component: DemandeFormComponent , canActivate: [roleGuard(['utilisateur'])]},
          { path: 'view/:id', component: DemandeFormComponent , canActivate: [roleGuard(['utilisateur'])]},
        ]
      },

      { path: 'demandes', component: DemandesListComponent },

      // Bordereaux
      { path: 'bordereau-reception', component: BordereauReceptionComponent },
      {
        path: 'bordereaux',canActivate: [roleGuard(['agent'])],
        children: [
          { path: '', component: GestionBordereauComponent },
          { path: ':id', component: GestionBordereauComponent }
        ]
      },

      // Stock
      { path: 'stock', component: StockComponent }
    ]
  },

  // Fallback vers /unauthorized pour mieux tracer les erreurs
  { path: '**', redirectTo: 'unauthorized' }
];

