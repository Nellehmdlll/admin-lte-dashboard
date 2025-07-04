import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Marque {
  id: number;
  nom: string;
  description: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
  dateModification?: Date;
  nombreModeles?: number;
}

@Component({
  selector: 'app-marque-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marque-detail.component.html',
  styleUrl: './marque-detail.component.scss'
})
export class MarqueDetailComponent implements OnInit {
  marque: Marque | null = null;
  loading = true;
  marqueId: number | null = null;

  // Données factices pour la démo
  private dummyMarques: Marque[] = [
    {
      id: 1,
      nom: 'Yamaha',
      description: 'Fabricant japonais de motos',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      dateModification: new Date('2024-01-15'),
      nombreModeles: 12
    },
    {
      id: 2,
      nom: 'Honda',
      description: 'Fabricant japonais de motos et automobiles',
      statut: 'actif',
      dateCreation: new Date('2024-01-10'),
      dateModification: new Date('2024-01-12'),
      nombreModeles: 18
    },
    {
      id: 3,
      nom: 'Kawasaki',
      description: 'Fabricant japonais de motos et véhicules',
      statut: 'inactif',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      nombreModeles: 8
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.marqueId = +id;
        this.loadMarque(this.marqueId);
      } else {
        this.router.navigate(['/settings/marque-moto']);
      }
    });
  }

  private loadMarque(id: number): void {
    this.loading = true;
    
    // Simulation de chargement
    setTimeout(() => {
      const marque = this.dummyMarques.find(m => m.id === id);
      if (marque) {
        this.marque = { ...marque };
      } else {
        // Rediriger si la marque n'existe pas
        this.router.navigate(['/settings/marque-moto']);
      }
      this.loading = false;
    }, 500);
  }

  onEdit(): void {
    if (this.marqueId) {
      this.router.navigate(['/settings/marque-moto', this.marqueId, 'modifier']);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/settings/marque-moto']);
  }

  getStatusBadgeClass(statut: string): string {
    return statut === 'actif' ? 'bg-success' : 'bg-secondary';
  }

  getStatusText(statut: string): string {
    return statut === 'actif' ? 'Actif' : 'Inactif';
  }
}
