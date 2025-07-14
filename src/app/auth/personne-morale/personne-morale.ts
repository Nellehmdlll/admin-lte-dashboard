import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personne-morale',
  standalone: true,
  templateUrl: './personne-morale.html',
  styleUrls: ['./personne-morale.scss'],
  imports: [CommonModule, FormsModule]
})
export class PersonneMorale {
  nomEntreprise = '';
  numeroRCCM = '';
  nif = '';
  siegeSocial = '';

  constructor(private router: Router) {}

  valider() {
    // tu peux stocker les infos ici si tu veux
    console.log({
      nomEntreprise: this.nomEntreprise,
      numeroRCCM: this.numeroRCCM,
      nif: this.nif,
      siegeSocial: this.siegeSocial
    });

    this.router.navigate(['/dashboard']);
  }
}
