import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  form = {
    nom: '',
    prenom: '',
    civilite: '',
    date_naissance: '',
    numero_nip: '',
    profession: '',
    email: '',
    password: ''
  };
  email: any;
  password: any;
  nom: any;
  prenom: any;

  constructor(private router: Router) {} // injection du routeur

register() {
  if (this.email && this.password && this.nom && this.prenom) {
    this.router.navigate(['/login']); // après inscription
  }
}

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
