import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Ministere {
  id: number;
  code: string;
  nom: string;
  sigle: string;
  description: string;
  adresse: string;
  telephone: string;
  email: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
  dateModification: Date;
}

@Component({
  selector: 'app-ministere-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ministere-detail.component.html',
  styleUrls: ['./ministere-detail.component.scss']
})
export class MinistereDetailComponent implements OnInit {
  ministere: Ministere | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMinistere();
  }

  loadMinistere(): void {
    const ministereId = this.route.snapshot.paramMap.get('id');
    
    if (!ministereId) {
      this.error = 'Aucun ID de ministère spécifié';
      this.loading = false;
      return;
    }

    // Simuler un chargement depuis une API
    setTimeout(() => {
      try {
        // Données de démonstration
        this.ministere = {
          id: +ministereId,
          code: `MIN${ministereId.padStart(2, '0')}`,
          nom: `Ministère de l'Exemple ${ministereId}`,
          sigle: `ME${ministereId}`,
          description: `Description détaillée du ministère de l'exemple ${ministereId}. Ce ministère est responsable de...`,
          adresse: `${ministereId} Avenue des Ministères, Plateau, Abidjan, Côte d'Ivoire`,
          telephone: `+225 01 23 45 67 8${ministereId}`,
          email: `contact@ministere${ministereId}.gouv.ci`,
          statut: 'actif',
          dateCreation: new Date('2024-01-15T10:30:00'),
          dateModification: new Date('2024-02-20T14:45:00')
        };
        this.loading = false;
      } catch (err) {
        this.error = 'Erreur lors du chargement du ministère';
        this.loading = false;
        console.error(err);
      }
    }, 800);
  }

  onEdit(): void {
    if (this.ministere) {
      this.router.navigate(['/settings/ministere/edit', this.ministere.id]);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/settings/ministere']);
  }

  getStatusBadgeClass(status: string): string {
    return status === 'actif' ? 'bg-success' : 'bg-secondary';
  }

  getStatusText(status: string): string {
    return status === 'actif' ? 'Actif' : 'Inactif';
  }
}
