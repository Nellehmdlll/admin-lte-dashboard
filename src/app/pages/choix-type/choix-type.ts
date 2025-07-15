import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choix-type',
  standalone: true,
  templateUrl: './choix-type.html',
  styleUrls: ['./choix-type.css'],
  imports: [CommonModule]
})
export class ChoixType {

  constructor(private router: Router) {}
  // Méthode pour choisir le type d'utilisateur
  choisir(type: 'physique' | 'morale') {
  localStorage.setItem('typeUtilisateur', type);
  if (type === 'morale') {
    this.router.navigate(['/personne-morale']);
  } else {
    this.router.navigate(['/personne-physique']);
  }
}


}
