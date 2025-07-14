
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importation du service d'authentification

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule] //
})
export class Login {
  email = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {} //  Injection du service d'authentification

  login() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response: any) => {
      //stocker token
      localStorage.setItem('token', response.token);

      // Naviguer vers dashboard après connexion réussie
      this.router.navigate(['/dashboard']);
    },
    error: (err: any) => {
      console.error('Erreur de connexion', err);
      alert('Email ou mot de passe incorrect');
    }
  });
}


  goToRegister() {
    this.router.navigate(['/register']);
  }
}
