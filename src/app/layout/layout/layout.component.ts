import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router'; // ✅ Importer RouterModule ici

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [FooterComponent, SidebarComponent, HeaderComponent,RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {

  userPrenom = localStorage.getItem('prenom');
  authService: any;
  router: any;

    logout() {
  this.authService.logout(); // supprime le token
  this.router.navigate(['/login']); // redirige vers login
}

}
