import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  role: string | null = null;
  isParametresOpen = false;
  activeLink: string | null = null;

  userPrenom = localStorage.getItem('prenom');



  constructor(private router: Router, private authService: AuthService) {
    this.role = this.authService.getUserRole();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveLink();
    });
  }

  isUser(): boolean {
    return this.role === 'utilisateur';
  }

  isAgent(): boolean {
    return this.role === 'agent_mica';
  }

  isAdmin(): boolean {
    return this.role === 'superadmin';
  }

  toggleParametres(event: Event): void {
    event.preventDefault();
    this.isParametresOpen = !this.isParametresOpen;
  }

  private updateActiveLink(): void {
    const url = this.router.url;
    if (url.includes('marque')) this.activeLink = 'marque';
    else if (url.includes('type')) this.activeLink = 'type';
    else if (url.includes('ministere')) this.activeLink = 'ministere';
    else this.activeLink = null;
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
    this.isParametresOpen = true;
  }

  logout() {
  this.authService.logout(); // supprime le token
  this.router.navigate(['/login']); // redirige vers login
}
}
