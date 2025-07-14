
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
    this.authService.login();
    this.router.navigate(['/dashboard']); // Redirection vers le choix du type d'utilisateur
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
