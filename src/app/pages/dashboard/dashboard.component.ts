import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StatusColorPipe } from '../../shared/pipes/status-color.pipe';
import {
  TypeDemande,
  StatutDemande,
  MotifDemande,
  FichierJoint,
  Demande,
  Destinataire,
  MarqueMoto,
  TypeMoto,
} from '../../shared/models/demande.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatusColorPipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  // Enums pour le template
  TypeDemande = TypeDemande;
  StatutDemande = StatutDemande;
  MotifDemande = MotifDemande;
  FichierJoint = FichierJoint;

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
      fichierJoint: FichierJoint.BON_DE_LIVRAISON,
      // fichierJoint: FichierJoint.FACTURE,
      quantiteMoto: 5,
      valeur: 2500000,
      // Nouvelles propriétés
      marquemoto: MarqueMoto.YAMAHA,
      typemoto: TypeMoto.Moto,
      // moto: Moto.MT_07,
      quantite:5000,
      prix:540000000,
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
      // fichierJoint: FichierJoint.BON_DE_LIVRAISON,
      quantiteMoto: 3,
      valeur: 1800000,
      // Nouvelles propriétés
      marquemoto: MarqueMoto.HONDA,
      typemoto: TypeMoto.Moto,
      // moto: Moto.MT_07,
      quantite:300,
      prix:3900000000,
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
      // Nouvelles propriétés
      marquemoto: MarqueMoto.KAWASAKI,
      typemoto: TypeMoto.Moto,
      // moto: Moto.MT_07,
      quantite:10,
      prix:100000000,
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

  constructor(private router: Router) {}

  // Obtient les demandes par statut
  getDemandesByStatus(statut: StatutDemande): Demande[] {
    return this.demandes.filter(d => d.statut === statut);
  }

  // Obtient les demandes les plus récentes
  getRecentDemandes(limit: number = 5): Demande[] {
    return [...this.demandes]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Affiche les détails d'une demande
  viewDemandeDetails(demande: Demande): void {
    this.router.navigate(['/demande', demande.id]);
  }

  // Redirige vers le formulaire de modification
  editDemande(demande: Demande, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/demande/edit', demande.id]);
  }

  // Gère le téléchargement du bordereau
  downloadBordereau(id: number, event: Event): void {
    event.stopPropagation();
    // Implémentez la logique de téléchargement ici
    console.log('Téléchargement du bordereau', id);
  }
}
