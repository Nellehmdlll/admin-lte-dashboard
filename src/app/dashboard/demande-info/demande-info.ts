import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demande-info',
  standalone: true,
  templateUrl: './demande-info.html',
  imports: [CommonModule]
})
export class DemandeInfo {
  demandeId: string | null = null;
  demandeDetails: any;

  constructor(private route: ActivatedRoute) {
    this.demandeId = this.route.snapshot.paramMap.get('id');

    // ⚠️ données mockées – à remplacer par un appel API réel si besoin
    const allDemandes = [
      { id: '1', nom: 'Demande A', date: '2025-06-01', statut: 'En cours', commentaire: 'Attente validation' },
      { id: '2', nom: 'Demande B', date: '2025-06-02', statut: 'Acceptée', commentaire: 'Validée sans remarques' }
    ];

    this.demandeDetails = allDemandes.find(d => d.id === this.demandeId);
  }
}
