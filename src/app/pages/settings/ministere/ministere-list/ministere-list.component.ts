import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Ministere {
  id: number;
  code: string;
  nom: string;
  sigle: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
}

@Component({
  selector: 'app-ministere-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ministere-list.component.html',
  styleUrls: ['./ministere-list.component.scss']
})
export class MinistereListComponent implements OnInit {
  ministeres: Ministere[] = [];
  filteredMinisteres: Ministere[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  loading: boolean = false;
  Math = Math;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMinisteres();
  }

  loadMinisteres(): void {
    this.loading = true;
    
    // Simuler un appel API
    setTimeout(() => {
      this.ministeres = [
        { id: 1, code: 'MIN01', nom: 'Ministère de la Santé', sigle: 'MS', statut: 'actif', dateCreation: new Date('2024-01-15') },
        { id: 2, code: 'MIN02', nom: 'Ministère de l\'Éducation Nationale', sigle: 'MEN', statut: 'actif', dateCreation: new Date('2024-01-16') },
        { id: 3, code: 'MIN03', nom: 'Ministère des Finances', sigle: 'MF', statut: 'inactif', dateCreation: new Date('2024-01-17') },
        { id: 4, code: 'MIN04', nom: 'Ministère de l\'Intérieur', sigle: 'MI', statut: 'actif', dateCreation: new Date('2024-01-18') },
        { id: 5, code: 'MIN05', nom: 'Ministère des Affaires Étrangères', sigle: 'MAE', statut: 'actif', dateCreation: new Date('2024-01-19') }
      ];
      
      this.filteredMinisteres = [...this.ministeres];
      this.totalItems = this.ministeres.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.loading = false;
    }, 500);
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredMinisteres = [...this.ministeres];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredMinisteres = this.ministeres.filter(m => 
        m.nom.toLowerCase().includes(term) || 
        m.code.toLowerCase().includes(term) ||
        m.sigle.toLowerCase().includes(term)
      );
    }
    this.totalItems = this.filteredMinisteres.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }

  getStatusBadgeClass(status: string): string {
    return status === 'actif' ? 'bg-success' : 'bg-secondary';
  }

  getStatusText(status: string): string {
    return status === 'actif' ? 'Actif' : 'Inactif';
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginatedItems(): Ministere[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMinisteres.slice(startIndex, endIndex);
  }

  onAddMinistere(): void {
    this.router.navigate(['/settings/ministere/new']);
  }

  onViewMinistere(id: number): void {
    this.router.navigate(['/settings/ministere/view', id]);
  }

  onEditMinistere(id: number): void {
    this.router.navigate(['/settings/ministere/edit', id]);
  }
}
