import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface Marque {
  id: number;
  nom: string;
  description: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
  dateModification?: Date;
}

@Component({
  selector: 'app-marque-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgClass,
    DatePipe
  ],
  templateUrl: './marque-list.component.html',
  styleUrl: './marque-list.component.scss'
})
export class MarqueListComponent implements OnInit {
  marques: Marque[] = [];
  filteredMarques: Marque[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  loading: boolean = true;

  // Données factices pour la démo
  private dummyMarques: Marque[] = [
    {
      id: 1,
      nom: 'Yamaha',
      description: 'Fabricant japonais de motos',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      dateModification: new Date('2024-01-15')
    },
    {
      id: 2,
      nom: 'Honda',
      description: 'Fabricant japonais de motos et automobiles',
      statut: 'actif',
      dateCreation: new Date('2024-01-10'),
      dateModification: new Date('2024-01-12')
    },
    {
      id: 3,
      nom: 'Kawasaki',
      description: 'Fabricant japonais de motos et véhicules',
      statut: 'inactif',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10')
    }
  ];
Math: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMarques();
  }

  private loadMarques(): void {
    this.loading = true;
    // Simulation de chargement
    setTimeout(() => {
      this.marques = [...this.dummyMarques];
      this.filteredMarques = [...this.marques];
      this.totalItems = this.marques.length;
      this.loading = false;
    }, 800);
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredMarques = [...this.marques];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredMarques = this.marques.filter(marque =>
        marque.nom.toLowerCase().includes(term) ||
        marque.description.toLowerCase().includes(term)
      );
    }
    this.totalItems = this.filteredMarques.length;
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onCreateMarque(): void {
    this.router.navigate(['/settings/marque/new']);
  }

  onViewMarque(id: number): void {
    this.router.navigate(['/settings/marque/view', id]);
  }

  onEditMarque(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/settings/marque/edit', id]);
  }

  onDeleteMarque(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
      // Ici, vous devriez appeler votre service pour supprimer la marque
      console.log('Suppression de la marque', id);
      this.marques = this.marques.filter(m => m.id !== id);
      this.filteredMarques = this.filteredMarques.filter(m => m.id !== id);
      this.totalItems = this.filteredMarques.length;
    }
  }

  toggleMarqueStatus(marque: Marque, event: Event): void {
    event.stopPropagation();
    const newStatus = marque.statut === 'actif' ? 'inactif' : 'actif';
    // Ici, vous devriez appeler votre service pour mettre à jour le statut
    console.log(`Changement du statut de ${marque.nom} à ${newStatus}`);
    marque.statut = newStatus as 'actif' | 'inactif';
    marque.dateModification = new Date();
  }

  getStatusBadgeClass(statut: string): string {
    return statut === 'actif' ? 'bg-success' : 'bg-secondary';
  }

  get paginatedMarques(): Marque[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredMarques.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
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

  // Méthode pour changer de page
  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
    }
  }
}
