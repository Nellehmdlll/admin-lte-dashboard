
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
typeUtilisateur: string | null = null;

constructor(private router: Router, private authService: AuthService) {
  this.typeUtilisateur = localStorage.getItem('typeUtilisateur');
}


  // Propriétés pour les statistiques
  demandesEnCours = 5;
  demandesAcceptees = 10;
  demandesRejetees = 2;
  totalDemandes = 17;

  demandesEnCoursList = [
    { id: 1, nom: 'Demande A', date: '2025-06-01' },
    { id: 2, nom: 'Demande B', date: '2025-06-02' }
  ];

  bordereauxSoumisList = [
    { id: 1, nom: 'Bordereau X', date: '2025-06-01' },
    { id: 2, nom: 'Bordereau Y', date: '2025-06-03' }
  ];


  //constructor(private router: Router) {}


logout() {
  this.authService.logout();
  localStorage.removeItem('typeUtilisateur'); // nettoie l’info
  this.router.navigate(['/login']);
}


}

