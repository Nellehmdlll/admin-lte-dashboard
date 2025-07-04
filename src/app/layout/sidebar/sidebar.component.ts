import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // État du menu Paramètres
  isParametresOpen = false;
  activeLink: string | null = null;

  constructor(private router: Router) {
    // S'abonner aux changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveLink();
    });
  }

  // Basculer l'état d'ouverture du menu Paramètres
  toggleParametres(event: Event): void {
    event.preventDefault();
    this.isParametresOpen = !this.isParametresOpen;
  }

  // Mettre à jour le lien actif en fonction de l'URL
  private updateActiveLink(): void {
    const url = this.router.url;
    if (url.includes('marque-moto')) {
      this.activeLink = 'marque-moto';
      this.isParametresOpen = true;
    } else if (url.includes('type-moto')) {
      this.activeLink = 'type-moto';
      this.isParametresOpen = true;
    } else if (url.includes('ministere')) {
      this.activeLink = 'ministere';
      this.isParametresOpen = true;
    } else {
      this.activeLink = null;
    }
  }

  // Définir le lien actif
  setActiveLink(link: string): void {
    this.activeLink = link;
    this.isParametresOpen = true;
  }
}
