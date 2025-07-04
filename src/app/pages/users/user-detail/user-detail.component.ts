import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../users.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = true;
  
  // Données factices pour la démo
  private dummyUsers: User[] = [
    {
      id: 1,
      nom: 'Admin',
      prenom: 'Système',
      email: 'admin@mica.cm',
      telephone: '237 6XX XXX XXX',
      role: 'Administrateur',
      dateCreation: new Date('2024-01-01'),
      statut: 'actif'
    },
    {
      id: 2,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      telephone: '237 6YY YYY YYY',
      role: 'Gestionnaire',
      dateCreation: new Date('2024-02-15'),
      statut: 'actif'
    },
    {
      id: 3,
      nom: 'Smith',
      prenom: 'Jane',
      email: 'jane.smith@example.com',
      telephone: '237 6ZZ ZZZ ZZZ',
      role: 'Utilisateur',
      dateCreation: new Date('2024-03-10'),
      statut: 'inactif'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('id'));
      this.loadUser(userId);
    });
  }

  private loadUser(userId: number): void {
    this.loading = true;
    // Simulation de chargement
    setTimeout(() => {
      this.user = this.dummyUsers.find(u => u.id === userId) || null;
      this.loading = false;
    }, 500);
  }

  getStatusBadgeClass(statut: string): string {
    switch (statut) {
      case 'actif': return 'bg-success';
      case 'inactif': return 'bg-warning';
      case 'suspendu': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Administrateur': return 'bg-primary';
      case 'Gestionnaire': return 'bg-success';
      case 'Utilisateur': 
      default: 
        return 'bg-secondary';
    }
  }

  onEdit(): void {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/users']);
  }

  // Suspendre un utilisateur
  suspendUser(): void {
    if (this.user && confirm(`Êtes-vous sûr de vouloir suspendre l'accès de ${this.user.prenom} ${this.user.nom} ?`)) {
      // Ici, vous devriez appeler votre service pour suspendre l'utilisateur
      console.log(`Suspension de l'utilisateur ${this.user.id}`);
      // Mise à jour locale pour l'exemple
      this.user.statut = 'suspendu';
    }
  }

  // Réactiver un utilisateur
  reactivateUser(): void {
    if (this.user && confirm(`Êtes-vous sûr de vouloir réactiver le compte de ${this.user.prenom} ${this.user.nom} ?`)) {
      // Ici, vous devriez appeler votre service pour réactiver l'utilisateur
      console.log(`Réactivation de l'utilisateur ${this.user.id}`);
      // Mise à jour locale pour l'exemple
      this.user.statut = 'actif';
    }
  }
}
