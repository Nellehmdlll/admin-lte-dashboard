import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TypeMoto {
  id: number;
  nom: string;
  description: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
  dateModification: Date;
}

@Component({
  selector: 'app-type-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DatePipe
  ],
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss']
})
export class TypeListComponent implements OnInit {
  types: TypeMoto[] = [];
  filteredTypes: TypeMoto[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;
  loading: boolean = false;
Math: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Données de démonstration - À remplacer par un appel API
    this.types = [
      {
        id: 1,
        nom: 'Sportive',
        description: 'Motos conçues pour la performance et la vitesse',
        statut: 'actif',
        dateCreation: new Date('2024-01-15'),
        dateModification: new Date('2024-01-15')
      },
      {
        id: 2,
        nom: 'Roadster',
        description: 'Motos polyvalentes pour la ville et la route',
        statut: 'actif',
        dateCreation: new Date('2024-02-01'),
        dateModification: new Date('2024-02-05')
      },
      {
        id: 3,
        nom: 'Custom',
        description: 'Motos personnalisées avec un look rétro',
        statut: 'actif',
        dateCreation: new Date('2024-01-20'),
        dateModification: new Date('2024-02-10')
      }
    ];

    this.filteredTypes = [...this.types];
    this.totalItems = this.types.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTypes = [...this.types];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTypes = this.types.filter(type =>
        type.nom.toLowerCase().includes(term) ||
        type.description.toLowerCase().includes(term)
      );
    }
    this.totalItems = this.filteredTypes.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedTypes(): TypeMoto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTypes.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onCreateType(): void {
    this.router.navigate(['/settings/type/new']);
  }

  onViewType(id: number): void {
    this.router.navigate(['/settings/type/view', id]);
  }

  onEditType(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/settings/type/edit', id]);
  }

  onDeleteType(id: number, event: Event): void {
    event.stopPropagation();
    // À implémenter : logique de suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de moto ?')) {
      console.log('Suppression du type avec ID:', id);
      // Mettre à jour la liste après suppression
      this.types = this.types.filter(type => type.id !== id);
      this.applyFilter();
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pageNumbers(): (number | string)[] {
    const range: (number | string)[] = [];
    const delta = 2;
    const left = this.currentPage - delta;
    const right = this.currentPage + delta + 1;

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= left && i < right)) {
        range.push(i);
      } else if (i === left - 1 || i === right) {
        range.push('...');
      }
    }

    return range.filter((item, index, array) => array.indexOf(item) === index);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
    }
  }
}
