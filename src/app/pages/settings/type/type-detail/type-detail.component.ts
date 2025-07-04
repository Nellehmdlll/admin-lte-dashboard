import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface TypeMoto {
  id: number;
  nom: string;
  description: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
  dateModification: Date;
}

@Component({
  selector: 'app-type-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './type-detail.component.html',
  styleUrls: ['./type-detail.component.scss']
})
export class TypeDetailComponent implements OnInit {
  type: TypeMoto | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadType();
  }

  loadType(): void {
    const typeId = this.route.snapshot.paramMap.get('id');
    
    if (!typeId) {
      this.error = 'Aucun ID de type spécifié';
      this.loading = false;
      return;
    }

    // Simulation de chargement d'un type
    // À remplacer par un appel API réel
    setTimeout(() => {
      try {
        // Données de démonstration
        this.type = {
          id: +typeId,
          nom: 'Sportive',
          description: 'Motos conçues pour la performance et la vitesse, idéales pour les routes sinueuses et les circuits.',
          statut: 'actif',
          dateCreation: new Date('2024-01-15T10:30:00'),
          dateModification: new Date('2024-02-20T14:45:00')
        };
        this.loading = false;
      } catch (err) {
        this.error = 'Erreur lors du chargement du type de moto';
        this.loading = false;
        console.error(err);
      }
    }, 800);
  }

  onEdit(): void {
    if (this.type) {
      this.router.navigate(['/settings/type/edit', this.type.id]);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/settings/type']);
  }

  getStatusBadgeClass(status: string): string {
    return status === 'actif' ? 'bg-success' : 'bg-secondary';
  }

  getStatusText(status: string): string {
    return status === 'actif' ? 'Actif' : 'Inactif';
  }
}
