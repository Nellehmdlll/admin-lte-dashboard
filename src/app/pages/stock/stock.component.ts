import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Moto {
  id: number;
  modele: string;
  marque: string;
  type: string;
  annee: number;
}

interface StockItem {
  id: number;
  moto: Moto;
  quantite: number;
}

interface Structure {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  ville?: string; // Ajout de la propriété ville optionnelle
  stocks: StockItem[];
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIf, NgFor],
  templateUrl: './stock.component.html',
  // Suppression de la référence au fichier SCSS manquant
  styles: [`
    .cursor-pointer { cursor: pointer; transition: background-color 0.2s; }
    .cursor-pointer:hover { background-color: rgba(0, 0, 0, 0.02); }
    .badge { min-width: 80px; padding: 0.5em 0.75em; font-weight: 500; font-size: 0.85em; border-radius: 50rem; }
    .bg-success { background-color: #d1fae5 !important; color: #065f46 !important; }
    .bg-warning { background-color: #fef3c7 !important; color: #92400e !important; }
    .bg-danger { background-color: #fee2e2 !important; color: #b91c1c !important; }
    .loading-spinner { width: 2rem; height: 2rem; border: 0.25em solid rgba(13, 110, 253, 0.3); border-top-color: #0d6efd; border-radius: 50%; animation: spin 1s linear infinite; margin: 2rem auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) {
      .table-responsive { font-size: 0.875rem; }
      .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    }
    .card { border: none; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); margin-bottom: 1.5rem; }
    .card .card-header { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(0, 0, 0, 0.05); background-color: #f8f9fa; }
    .card .card-body { padding: 1.25rem; }
    .table { margin-bottom: 0; }
    .table th { font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; color: #6c757d; padding: 0.75rem 1rem; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; }
    .table td { padding: 1rem; vertical-align: middle; border-top: 1px solid #e9ecef; }
    .table tr:last-child td { border-bottom: 1px solid #e9ecef; }
  `]
})
export class StockComponent implements OnInit {
  // Données simulées
  structures: Structure[] = [
    {
      id: 1,
      nom: 'Dépôt Central',
      adresse: '123 Avenue des Moto, Yaoundé',
      telephone: '237 6XX XXX XXX',
      email: 'depot@example.com',
      stocks: [
        { id: 1, quantite: 15, moto: { id: 1, modele: 'YZF-R15', marque: 'Yamaha', type: 'Sportive', annee: 2023 } },
        { id: 2, quantite: 8, moto: { id: 2, modele: 'CBR150R', marque: 'Honda', type: 'Sportive', annee: 2023 } },
      ]
    },
    {
      id: 2,
      nom: 'Succursale Douala',
      adresse: '456 Boulevard du Port, Douala',
      telephone: '237 6YY YYY YYY',
      email: 'douala@example.com',
      stocks: [
        { id: 3, quantite: 10, moto: { id: 1, modele: 'YZF-R15', marque: 'Yamaha', type: 'Sportive', annee: 2023 } },
        { id: 4, quantite: 5, moto: { id: 3, modele: 'Pulsar NS200', marque: 'Bajaj', type: 'Roadster', annee: 2023 } },
      ]
    },
    {
      id: 3,
      nom: 'Succursale Bafoussam',
      adresse: '789 Avenue des Montagnes, Bafoussam',
      telephone: '237 6ZZ ZZZ ZZZ',
      email: 'bafoussam@example.com',
      stocks: [
        { id: 5, quantite: 7, moto: { id: 2, modele: 'CBR150R', marque: 'Honda', type: 'Sportive', annee: 2023 } },
        { id: 6, quantite: 12, moto: { id: 4, modele: 'Boxer CT', marque: 'Bajaj', type: 'Utilitaire', annee: 2023 } },
      ]
    }
  ];

  // État du composant
  selectedStructure: Structure | null = null;
  searchTerm: string = '';
  filteredStructures: Structure[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredStructures = [...this.structures];
  }

  // Sélectionner une structure
  selectStructure(structure: Structure): void {
    this.selectedStructure = structure;
  }

  // Revenir à la liste des structures
  backToList(): void {
    this.selectedStructure = null;
  }

  // Filtrer les structures
  filterStructures(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStructures = [...this.structures];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredStructures = this.structures.filter(structure => 
      structure.nom.toLowerCase().includes(searchLower) ||
      structure.adresse.toLowerCase().includes(searchLower) ||
      structure.ville?.toLowerCase().includes(searchLower)
    );
  }

  // Obtenir la classe CSS en fonction de la quantité
  getStockClass(quantite: number): string {
    if (quantite === 0) return 'bg-danger text-white';
    if (quantite < 5) return 'bg-warning text-dark';
    return 'bg-success text-white';
  }
}
