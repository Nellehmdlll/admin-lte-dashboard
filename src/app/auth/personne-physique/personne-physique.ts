import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personne-physique',
  standalone: true,
  templateUrl: './personne-physique.html',
  styleUrls: ['./personne-physique.scss'],
  imports: [CommonModule, FormsModule]
})
export class PersonnePhysique {
  nom = '';
  prenom = '';
  dateNaissance = '';
  telephone = '';

  constructor(private router: Router) {}

  valider() {
    console.log({
      nom: this.nom,
      prenom: this.prenom,
      dateNaissance: this.dateNaissance,
      telephone: this.telephone
    });

    const toast = document.getElementById('successToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }
}
