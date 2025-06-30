import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatusColorPipe } from '../../shared/pipes/status-color.pipe';
import {
  TypeDemande,
  StatutDemande,
  Destinataire,
  MotifDemande,
  FichierJoint,
  Demande,
  MarqueMoto,
  TypeMoto,
  Moto,
} from '../../shared/models/demande.model';

@Component({
  selector: 'app-demandes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusColorPipe],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title" style="color: #049c4b;">
          <i class="fas fa-list-ul mr-2"></i>Liste des demandes
        </h3>
        <button class="btn btn-success" [routerLink]="['/demande/new']">
          <i class="fas fa-plus-circle mr-1"></i> Nouvelle demande
        </button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>N° Demande</th>
                <th>Date</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Émetteur</th>
                <th>Destinataire</th>
                <th class="text-end">Montant</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let demande of demandes" (click)="viewDemandeDetails(demande)" class="demande-row">
                <td class="font-weight-bold">{{ demande.numero }}</td>
                <td>{{ demande.date | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span class="badge bg-light text-dark border">
                    <i class="fas fa-tag mr-1"></i>{{ demande.type }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'bg-' + (demande.statut ? (demande.statut | statusColor) : 'secondary')">
                    <i class="fas fa-circle mr-1" style="font-size: 0.5em; vertical-align: middle;"></i>
                    {{ demande.statut | titlecase }}
                  </span>
                </td>
                <td>{{ demande.emetteur }}</td>
                <td>{{ demande.destinataire }}</td>
                <td class="text-end font-weight-bold">
                  {{ demande.valeur | number:'1.0-0' }} FCFA
                </td>
                <td class="text-center">
                  <div class="btn-group" role="group" (click)="$event.stopPropagation()">
                    <button class="btn btn-sm btn-outline-primary me-1"
                            [routerLink]="['/demande/edit', demande.id]"
                            title="Modifier">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info"
                            (click)="downloadBordereau(demande.id, $event)"
                            title="Télécharger le bordereau">
                      <i class="fas fa-file-pdf"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!demandes.length">
                <td colspan="8" class="text-center py-4">
                  <p class="text-muted">Aucune demande trouvée</p>
                  <button class="btn btn-link" [routerLink]="['/demande/new']">
                    Créer une nouvelle demande
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center" *ngIf="demandes.length">
        <div class="pagination-info text-muted">
          Affichage de 1 à {{ demandes.length }} sur {{ demandes.length }} demandes
        </div>
        <nav aria-label="Pagination">
          <ul class="pagination mb-0">
            <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li class="page-item active"><a class="page-link" href="#">1</a></li>
            <li class="page-item">
              <a class="page-link" href="#">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .demande-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .demande-row:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class DemandesListComponent {
  // Copier les données du dashboard component
  TypeDemande = TypeDemande;
  StatutDemande = StatutDemande;
  MotifDemande = MotifDemande;
  FichierJoint = FichierJoint;
  Destinataire = Destinataire;

  demandes: Demande[] = [
    {
      id: 1,
      numero: 'DEM-001',
      date: new Date('2023-01-01'),
      type: TypeDemande.ACHAT,
      statut: StatutDemande.EN_ATTENTE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Fournisseur ABC',
      destinataire: Destinataire.MICA,
      dateSoumission: new Date('2023-01-01'),
      fichierJoint: FichierJoint.FACTURE,
      quantiteMoto: 5,
      valeur: 2500000,
      // Ajout des propriétés manquantes avec des valeurs par défaut
      marquemoto: MarqueMoto.YAMAHA,
      typemoto: TypeMoto.Moto,
      moto: Moto.MT_07,
      quantite:6,
      prix:20000,
      nomImportateur: 'Import Motors',
      adresseImportateur: '123 Rue des Importateurs, Paris',
      telephoneImportateur: '+33123456789',
      emailImportateur: 'contact@import-motors.fr',
      nomAcheteur: 'John Doe',
      adresseAcheteur: '456 Avenue des Clients, Lyon',
      telephoneAcheteur: '+33612345678',
      emailAcheteur: 'john.doe@example.com',
      detailsComplementaires: 'Aucun détail supplémentaire',
      documentsFournis: ['Facture', 'Certificat de conformité'],
      dateValidation: null,
      motifRejet: null,
      utilisateurId: 1,
      dateCreation: new Date('2023-01-01T10:00:00Z'),
      dateMiseAJour: new Date('2023-01-01T10:00:00Z')
    },
    {
      id: 2,
      numero: 'DEM-002',
      date: new Date('2023-01-02'),
      type: TypeDemande.VENTE,
      statut: StatutDemande.VALIDE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Notre entreprise',
      destinataire: Destinataire.MICA,
      dateSoumission: new Date('2023-01-02'),
      fichierJoint: FichierJoint.BON_DE_LIVRAISON,
      quantiteMoto: 3,
      valeur: 1800000,
      // Ajout des propriétés manquantes avec des valeurs par défaut
      marquemoto: MarqueMoto.HONDA,
      typemoto: TypeMoto.Moto,
      moto: Moto.MT_07,
      quantite:3,
      prix:40000,
      nomImportateur: 'Moto Import',
      adresseImportateur: '456 Rue des Motos, Berlin',
      telephoneImportateur: '+493012345678',
      emailImportateur: 'contact@moto-import.de',
      nomAcheteur: 'Jane Smith',
      adresseAcheteur: '789 Boulevard des Acheteurs, Marseille',
      telephoneAcheteur: '+33698765432',
      emailAcheteur: 'jane.smith@example.com',
      detailsComplementaires: 'Vente avec facture proforma',
      documentsFournis: ['Bon de livraison', 'Facture proforma'],
      dateValidation: new Date('2023-01-03T15:30:00Z'),
      motifRejet: null,
      utilisateurId: 2,
      dateCreation: new Date('2023-01-02T09:15:00Z'),
      dateMiseAJour: new Date('2023-01-03T15:30:00Z')
    },
    {
      id: 3,
      numero: 'DEM-003',
      date: new Date('2023-01-03'),
      type: TypeDemande.IMPORTATION,
      statut: StatutDemande.REJETE,
      motif: MotifDemande.USAGE_PERSONNEL,
      emetteur: 'Fournisseur International',
      destinataire: Destinataire.MICA,
      dateSoumission: new Date('2023-01-03'),
      fichierJoint: FichierJoint.BON_DE_COMMANDE,
      quantiteMoto: 10,
      valeur: 7500000,
      // Ajout des propriétés manquantes avec des valeurs par défaut
      marquemoto: MarqueMoto.KAWASAKI,
      typemoto: TypeMoto.Moto,
      moto: Moto.MT_07,
      quantite:5,
      prix:50000,
      nomImportateur: 'Global Imports',
      adresseImportateur: '789 Import Street, New York',
      telephoneImportateur: '+12125551234',
      emailImportateur: 'info@global-imports.com',
      nomAcheteur: 'Notre entreprise',
      adresseAcheteur: '123 Rue des Entreprises, Paris',
      telephoneAcheteur: '+33123456789',
      emailAcheteur: 'contact@notre-entreprise.fr',
      detailsComplementaires: 'Commande groupée pour stock',
      documentsFournis: ['Bon de commande', 'Proforma'],
      dateValidation: null,
      motifRejet: 'Documents incomplets',
      utilisateurId: 3,
      dateCreation: new Date('2023-01-03T14:20:00Z'),
      dateMiseAJour: new Date('2023-01-04T11:45:00Z')
    }
  ];

  constructor() {}

  viewDemandeDetails(demande: Demande): void {
    // Implémentez la navigation vers les détails de la demande
    console.log('Voir les détails de la demande', demande);
  }

  downloadBordereau(id: number, event: Event): void {
    event.stopPropagation();
    // Implémentez le téléchargement du bordereau
    console.log('Télécharger le bordereau', id);
  }
}
