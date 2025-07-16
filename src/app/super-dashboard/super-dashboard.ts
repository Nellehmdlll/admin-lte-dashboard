/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-super-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './super-dashboard.html',
  styleUrls: ['./super-dashboard.css']
})
export class SuperDashboard implements OnInit {
  users: any[] = [];
  allRoles: string[] = ['utilisateur', 'admin', 'super-admin', 'gestionnaire'];

  ngOnInit() {
    // Données mockées
    this.users = [
      {
        id: 1,
        name: 'Alice Koné',
        email: 'alice@example.com',
        roles: ['utilisateur'],
        selectedRole: 'utilisateur'
      },
      {
        id: 2,
        name: 'Bob Traoré',
        email: 'bob@example.com',
        roles: ['admin'],
        selectedRole: 'admin'
      },
      {
        id: 3,
        name: 'Chantal Diallo',
        email: 'chantal@example.com',
        roles: ['gestionnaire'],
        selectedRole: 'gestionnaire'
      }
    ];
  }

  updateRole(user: any) {
    // Simule l'affectation du rôle en local
    user.roles = [user.selectedRole];

    alert(`Rôle de ${user.name} mis à jour en "${user.selectedRole}" (mocké)`);
  }
}
*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-super-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './super-dashboard.html',
  styleUrls: ['./super-dashboard.css']
})
export class SuperDashboard implements OnInit {
  users: any[] = [];
  search: string = '';
  allRoles: string[] = ['utilisateur', 'admin', 'super-admin', 'gestionnaire'];

  ngOnInit() {
    this.users = [
      {
        id: 1,
        name: 'Alice Koné',
        email: 'alice@example.com',
        roles: ['utilisateur'],
        selectedRole: 'utilisateur'
      },
      {
        id: 2,
        name: 'Bob Traoré',
        email: 'bob@example.com',
        roles: ['admin'],
        selectedRole: 'admin'
      },
      {
        id: 3,
        name: 'Chantal Diallo',
        email: 'chantal@example.com',
        roles: ['gestionnaire'],
        selectedRole: 'gestionnaire'
      }
    ];
  }

  filteredUsers() {
    if (!this.search) return this.users;
    const s = this.search.toLowerCase();
    return this.users.filter(
      u =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.roles[0].toLowerCase().includes(s)
    );
  }

  updateRole(user: any) {
    user.roles = [user.selectedRole];
    alert(`✅ Rôle de ${user.name} mis à jour en "${user.selectedRole}"`);
  }
}

