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
  TypeMoto
} from '../../shared/models/demande.model';
import { ToastrService } from 'ngx-toastr';

interface Bordereau {
  id: string;
  date: Date;
  type: string;
  statut: string;
  demandeAssociee: string;
  montantTotal: number;
  action: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusColorPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  // Statistiques
  stats = {
    totalDemandes: 156,
    demandesValidees: 89,
    demandesEnCours: 42,
    demandesRejetees: 25
  };

  // Données simulées pour les tableaux
  recentDemandes: Demande[] = [
    {
      id: 1,
      numero: 'DEM-2023-001',
      date: new Date('2023-05-15'),
      type: TypeDemande.IMPORTATION,
      statut: StatutDemande.EN_ATTENTE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Entreprise ABC',
      destinataire: Destinataire.MICA,
      dateSoumission: new Date('2023-05-15'),
      fichierJoint: FichierJoint.FACTURE,
      quantiteMoto: 10,
      valeur: 5000000,
      marquemoto: MarqueMoto.YAMAHA,
      typemoto: TypeMoto.Moto,
      quantite: 10,
      prix: 5000000,
      nomImportateur: 'Import Motors',
      adresseImportateur: '123 Rue des Importateurs, Douala',
      emailImportateur: 'contact@import-motors.cm',
      telephoneImportateur: '237 6XX XXX XXX',
      documentsFournis: [],
      utilisateurId: 1,
      dateCreation: new Date('2023-05-15'),
      dateMiseAJour: new Date('2023-05-15'),
      typeVendeur: 'Particulier',
      typeAcheteur: 'Entreprise',
      nomVendeur: 'Vendeur ABC',
      adresseVendeur: '123 Rue du Vendeur',
      telephoneVendeur: '237 6YY YYY YYY',
      emailVendeur: 'vendeur@example.com',
      nomAcheteur: 'Acheteur XYZ',
      adresseAcheteur: '456 Rue de l\'Acheteur',
      telephoneAcheteur: '237 6ZZ ZZZ ZZZ',
      emailAcheteur: 'acheteur@example.com',
    } as Demande,
    {
      id: 2,
      numero: 'DEM-2023-002',
      date: new Date('2023-05-15'),
      type: TypeDemande.ACHAT,
      statut: StatutDemande.VALIDE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Entreprise ABC',
      destinataire: Destinataire.MICA,
      dateSoumission: new Date('2023-05-15'),
      fichierJoint: FichierJoint.FACTURE,
      quantiteMoto: 10,
      valeur: 5000000,
      marquemoto: MarqueMoto.YAMAHA,
      typemoto: TypeMoto.Moto,
      quantite: 10,
      prix: 5000000,
      nomImportateur: 'Import Motors',
      adresseImportateur: '123 Rue des Importateurs, Douala',
      emailImportateur: 'contact@import-motors.cm',
      telephoneImportateur: '237 6XX XXX XXX',
      documentsFournis: [],
      utilisateurId: 1,
      dateCreation: new Date('2023-05-15'),
      dateMiseAJour: new Date('2023-05-15'),
      typeVendeur: 'Particulier',
      typeAcheteur: 'Entreprise',
      nomVendeur: 'Vendeur ABC',
      adresseVendeur: '123 Rue du Vendeur',
      telephoneVendeur: '237 6YY YYY YYY',
      emailVendeur: 'vendeur@example.com',
      nomAcheteur: 'Acheteur XYZ',
      adresseAcheteur: '456 Rue de l\'Acheteur',
      telephoneAcheteur: '237 6ZZ ZZZ ZZZ',
      emailAcheteur: 'acheteur@example.com',
    } as Demande,
    // Ajoutez plus de demandes simulées si nécessaire
  ];

  bordereaux: Bordereau[] = [
    {
      id: 'BORD-2023-001',
      date: new Date('2023-05-10'),
      type: 'Validation',
      statut: 'Validé',
      demandeAssociee: 'DEM-2023-001',
      montantTotal: 5000000,
      action: 'Consulter'
    },
    {
      id: 'BORD-2023-002',
      date: new Date('2023-05-10'),
      type: 'Validation',
      statut: 'Validé',
      demandeAssociee: 'DEM-2023-002',
      montantTotal: 5000000,
      action: 'Consulter'
    },
    // Ajoutez plus de bordereaux simulés si nécessaire
  ];

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

  // Ouvre les détails d'un bordereau
  ouvrirDetails(bordereau: Bordereau): void {
    // Utiliser la méthode voirBordereau existante qui gère déjà la navigation
    this.voirBordereau(bordereau.id);
  }

  /**
   * Redirige vers la page de consultation du stock
   */
  consulterStock(): void {
    this.router.navigate(['/stock']);
  }

  /**
   * Redirige vers la page de gestion des bordereaux pour afficher les détails d'un bordereau
   * @param bordereauId ID du bordereau à afficher
   */
  voirBordereau(bordereauId: string): void {
    console.log('Navigation vers le bordereau:', bordereauId);
    this.router.navigate(['/bordereaux', bordereauId])
      .then(success => {
        console.log('Navigation réussie:', success);
      })
      .catch(error => {
        console.error('Erreur de navigation:', error);
        // Essayer avec l'ancienne URL au cas où
        this.router.navigate(['/gestion-bordereaux', bordereauId]);
      });
  }

  /**
   * Valide un bordereau
   */
  validerBordereau(): void {
    if (this.selectedBordereau) {
      this.selectedBordereau.statut = 'Validé';
      this.selectedBordereau.action = 'Consulter';
      
      // Mettre à jour le statut de la demande associée si elle existe
      if (this.selectedDemande) {
        this.selectedDemande.statut = StatutDemande.VALIDE;
      }
      
      this.toastr.success('Bordereau validé avec succès', 'Succès');
      this.retourListeBordereaux();
    }
  }

  /**
   * Rejette un bordereau
   */
  rejeterBordereau(): void {
    if (this.selectedBordereau) {
      this.selectedBordereau.statut = 'Rejeté';
      this.selectedBordereau.action = 'Consulter';
      
      // Mettre à jour le statut de la demande associée si elle existe
      if (this.selectedDemande) {
        this.selectedDemande.statut = StatutDemande.REJETE;
      }
      
      this.toastr.warning('Bordereau rejeté', 'Information');
      this.retourListeBordereaux();
    }
  }

  /**
   * Retourne à la liste des bordereaux
   */
  retourListeBordereaux(): void {
    this.isViewingBordereau = false;
    this.selectedBordereau = null;
    this.selectedDemande = null;
  }

  // État de l'interface
  selectedBordereau: Bordereau | null = null;
  selectedDemande: Demande | null = null;
  isViewingBordereau = false;

  // Enums pour le template
  TypeDemande = TypeDemande;
  StatutDemande = StatutDemande;
  MotifDemande = MotifDemande;
  FichierJoint = FichierJoint;
  MarqueMoto = MarqueMoto;
  TypeMoto = TypeMoto;

  // Méthode pour obtenir la classe CSS en fonction du statut
  getStatusClass(statut: string): string {
    switch (statut) {
      case 'Validé':
        return 'text-success';
      case 'En attente':
        return 'text-warning';
      case 'Rejeté':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }
}
