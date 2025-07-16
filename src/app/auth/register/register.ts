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
  formData = {
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

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.formData).subscribe({
      next: (res: any) => {
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Erreur lors de l’inscription : ' + (err?.error?.message || err.message || 'Erreur inconnue'));
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
