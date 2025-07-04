import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  dateCreation: Date;
  statut: 'actif' | 'inactif' | 'suspendu';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  // Liste des utilisateurs
  users: User[] = [
    {
      id: 1,
      nom: 'Admin',
      prenom: 'Système',
      email: 'admin@mica.cm',
      role: 'Administrateur',
      telephone: '237 6XX XXX XXX',
      dateCreation: new Date('2024-01-01'),
      statut: 'actif'
    },
    {
      id: 2,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      role: 'Gestionnaire',
      telephone: '237 6YY YYY YYY',
      dateCreation: new Date('2024-02-15'),
      statut: 'actif'
    },
    {
      id: 3,
      nom: 'Smith',
      prenom: 'Jane',
      email: 'jane.smith@example.com',
      role: 'Utilisateur',
      telephone: '237 6ZZ ZZZ ZZZ',
      dateCreation: new Date('2024-03-10'),
      statut: 'inactif'
    }
  ];

  // Filtres
  searchTerm: string = '';
  selectedRole: string = 'tous';
  selectedStatus: string = 'tous';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Obtenir les utilisateurs filtrés
  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const matchesSearch =
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.selectedRole === 'tous' || user.role === this.selectedRole;
      const matchesStatus = this.selectedStatus === 'tous' || user.statut === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  // Pagination
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Changer de page
  changePage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
    }
  }

  // Obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  // Exposer Math au template
  Math = Math;

  // Obtenir les numéros de page à afficher
  get pageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift('...');
    }

    if (current + delta < total - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (total > 1) range.push(total);

    return range.filter((item, index, array) => array.indexOf(item) === index);
  }

  constructor(private router: Router) {}

  // Voir les détails d'un utilisateur
  viewUser(user: User): void {
    this.router.navigate(['/users/view', user.id]);
  }

  // Créer un nouvel utilisateur
  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  // Éditer un utilisateur
  editUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  // Supprimer un utilisateur
  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom} ?`)) {
      // Ici, vous devriez appeler votre service pour supprimer l'utilisateur
      console.log('Suppression de l\'utilisateur :', user);
      // Mise à jour de la liste locale pour l'exemple
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }

  // Changer le statut d'un utilisateur
  toggleUserStatus(user: User): void {
    const newStatus = user.statut === 'actif' ? 'inactif' : 'actif';
    // Ici, vous devriez appeler votre service pour mettre à jour le statut
    console.log(`Changement du statut de ${user.prenom} ${user.nom} à ${newStatus}`);
    // Mise à jour locale pour l'exemple
    user.statut = newStatus;
  }
}
