
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
      console.log('✅ Connexion réussie, réponse :', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.roles[0]);
      localStorage.setItem('prenom', response.prenom);

      const role = response.roles[0];
      console.log('📦 Rôle reçu :', role);

      if (role === 'superadmin') {
        this.router.navigate(['/users']);
      } else if (role === 'agent_mica') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
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
