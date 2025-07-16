import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule],
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
    password: '',
    telephone: ''
  };
  email: any;
  password: any;
  nom: any;
  prenom: any;
profession: any;
civilite: any;
date_naissance: any;
numero_nip: any;
telephone: any;

  constructor(private authService: AuthService, private router: Router) {}

register() {
  if (this.email && this.password && this.nom && this.prenom) {
    this.router.navigate(['/login']); // après inscription
  }
}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
