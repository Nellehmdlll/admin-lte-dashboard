import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StatusColorPipe } from '../../shared/pipes/status-color.pipe';

// Import des énumérations depuis le modèle partagé
import { 
  TypeDemande, 
  StatutDemande, 
  MotifDemande, 
  FichierJoint, 
  Demande 
} from '../../shared/models/demande.model';

// Service temporaire pour simuler un appel API
class DemandeService {
  private demandes: Demande[] = [
    {
      id: 1,
      numero: 'DEM-001',
      date: new Date('2023-01-01'),
      type: TypeDemande.ACHAT,
      statut: StatutDemande.EN_ATTENTE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Fournisseur ABC',
      destinataire: 'Notre entreprise',
      dateSoumission: new Date('2023-01-01'),
      fichierJoint: FichierJoint.FACTURE,
      quantiteMoto: 5,
      valeur: 2500000,
      // Nouvelles propriétés
      numeroInscription: 'ABC123',
      marque: 'Yamaha',
      modele: 'MT-07',
      anneeFabrication: 2022,
      numeroChassis: 'CH123456789',
      paysOrigine: 'Japon',
      paysProvenance: 'France',
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
      destinataire: 'Client XYZ',
      dateSoumission: new Date('2023-01-02'),
      fichierJoint: FichierJoint.BON_DE_LIVRAISON,
      quantiteMoto: 3,
      valeur: 1800000,
      // Nouvelles propriétés
      numeroInscription: 'XYZ789',
      marque: 'Honda',
      modele: 'CBR500R',
      anneeFabrication: 2021,
      numeroChassis: 'CH987654321',
      paysOrigine: 'Japon',
      paysProvenance: 'Allemagne',
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
      destinataire: 'Notre entreprise',
      dateSoumission: new Date('2023-01-03'),
      fichierJoint: FichierJoint.BON_DE_COMMANDE,
      quantiteMoto: 10,
      valeur: 7500000,
      // Nouvelles propriétés
      numeroInscription: 'IMP456',
      marque: 'Kawasaki',
      modele: 'Ninja ZX-10R',
      anneeFabrication: 2023,
      numeroChassis: 'CH456789123',
      paysOrigine: 'Japon',
      paysProvenance: 'États-Unis',
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

  getDemande(id: number): Demande | undefined {
    return this.demandes.find(d => d.id === id);
  }

  saveDemande(demande: Demande): Demande {
    const now = new Date();
    
    if (demande.id) {
      // Mise à jour d'une demande existante
      const index = this.demandes.findIndex(d => d.id === demande.id);
      if (index !== -1) {
        // Préserver l'ID, le numéro et les dates de création
        const existingDemande = this.demandes[index];
        const updatedDemande: Demande = {
          ...existingDemande, // Conserver toutes les propriétés existantes
          // Mettre à jour avec les nouvelles valeurs
          ...demande,
          // Ne pas écraser certaines propriétés importantes
          id: existingDemande.id,
          numero: existingDemande.numero,
          dateCreation: existingDemande.dateCreation,
          // Mettre à jour la date de modification
          dateMiseAJour: now
        };
        
        this.demandes[index] = updatedDemande;
        return updatedDemande;
      }
    } else {
      // Création d'une nouvelle demande
      const newId = Math.max(0, ...this.demandes.map(d => d.id)) + 1;
      const newNumero = `DEM-${String(newId).padStart(3, '0')}`;
      
      // Créer un nouvel objet avec toutes les propriétés requises
      const newDemande: Demande = {
        // Informations de base
        id: newId,
        numero: newNumero,
        date: now,
        type: demande.type || TypeDemande.ACHAT,
        statut: demande.statut || StatutDemande.EN_ATTENTE,
        motif: demande.motif || MotifDemande.AUTRE,
        emetteur: demande.emetteur || '',
        destinataire: demande.destinataire || '',
        fichierJoint: demande.fichierJoint || FichierJoint.AUTRE,
        quantiteMoto: demande.quantiteMoto || 1,
        valeur: demande.valeur || 0,
        dateSoumission: demande.dateSoumission || now,
        
        // Informations sur le véhicule
        numeroInscription: demande.numeroInscription || '',
        marque: demande.marque || '',
        modele: demande.modele || '',
        anneeFabrication: demande.anneeFabrication || now.getFullYear(),
        numeroChassis: demande.numeroChassis || '',
        paysOrigine: demande.paysOrigine || '',
        paysProvenance: demande.paysProvenance || '',
        
        // Informations sur l'importateur
        nomImportateur: demande.nomImportateur || '',
        adresseImportateur: demande.adresseImportateur || '',
        telephoneImportateur: demande.telephoneImportateur || '',
        emailImportateur: demande.emailImportateur || '',
        
        // Informations sur l'acheteur
        nomAcheteur: demande.nomAcheteur || '',
        adresseAcheteur: demande.adresseAcheteur || '',
        telephoneAcheteur: demande.telephoneAcheteur || '',
        emailAcheteur: demande.emailAcheteur || '',
        
        // Informations complémentaires
        detailsComplementaires: demande.detailsComplementaires || '',
        documentsFournis: Array.isArray(demande.documentsFournis) 
          ? [...demande.documentsFournis] 
          : [],
        
        // Validation et suivi
        dateValidation: demande.dateValidation || null,
        motifRejet: demande.motifRejet || null,
        utilisateurId: demande.utilisateurId || 1, // Remplacer par l'ID de l'utilisateur connecté
        dateCreation: now,
        dateMiseAJour: now
      };
      
      this.demandes.push(newDemande);
      return newDemande;
    }
    
    // Retourner la demande inchangée si aucun cas ne correspond
    return demande;
  }
}

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    StatusColorPipe,
    RouterModule
  ],
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss']
})
export class DemandeFormComponent implements OnInit {
  // Données de la demande
  demande: Partial<Demande> = {
    // Informations de base
    type: TypeDemande.ACHAT,
    statut: StatutDemande.EN_ATTENTE,
    motif: MotifDemande.COMMERCE,
    emetteur: '',
    destinataire: '',
    fichierJoint: FichierJoint.FACTURE,
    quantiteMoto: 1,
    valeur: 0,
    date: new Date(),
    dateSoumission: new Date(),
    
    // Informations sur le véhicule
    numeroInscription: '',
    marque: '',
    modele: '',
    anneeFabrication: new Date().getFullYear(),
    numeroChassis: '',
    paysOrigine: '',
    paysProvenance: '',
    
    // Informations sur l'importateur
    nomImportateur: '',
    adresseImportateur: '',
    telephoneImportateur: '',
    emailImportateur: '',
    
    // Informations sur l'acheteur
    nomAcheteur: '',
    adresseAcheteur: '',
    telephoneAcheteur: '',
    emailAcheteur: '',
    
    // Informations complémentaires
    detailsComplementaires: '',
    documentsFournis: [],
    
    // Validation et suivi
    utilisateurId: 1, // À remplacer par l'ID de l'utilisateur connecté
    dateCreation: new Date(),
    dateMiseAJour: new Date()
  };
  
  // Exposer les énumérations pour le template
  TypeDemande = TypeDemande;
  StatutDemande = StatutDemande;
  MotifDemande = MotifDemande;
  FichierJoint = FichierJoint;
  
  // État du composant
  isEditMode = false;
  isViewMode = false;
  isLoading = true;
  
  // Service temporaire (à remplacer par un vrai service)
  private demandeService = new DemandeService();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const isEdit = this.route.snapshot.url.some(segment => segment.path === 'edit');
      
      if (id) {
        if (isEdit) {
          // Mode édition
          this.isEditMode = true;
          this.loadDemande(+id);
        } else {
          // Mode consultation
          this.isViewMode = true;
          this.loadDemande(+id);
        }
      } else {
        // Mode création
        this.isLoading = false;
      }
    });
  }
  
  private loadDemande(id: number): void {
    const demande = this.demandeService.getDemande(id);
    if (demande) {
      // Mettre à jour uniquement les propriétés existantes dans la demande
      this.demande = {
        ...this.demande, // Conserver les valeurs par défaut pour les champs non fournis
        ...demande,     // Écraser avec les valeurs de la demande chargée
        dateValidation: demande.dateValidation || null,
        motifRejet: demande.motifRejet || null,
        documentsFournis: demande.documentsFournis || [],
        detailsComplementaires: demande.detailsComplementaires || ''
      };
    } else {
      // Gérer le cas où la demande n'est pas trouvée
      console.error(`Demande avec l'ID ${id} non trouvée`);
      this.router.navigate(['/']);
    }
    this.isLoading = false;
  }

  onSubmit(): void {
    if (this.isViewMode) {
      this.isViewMode = false;
      return;
    }

    // Préparer les données à sauvegarder
    const demandeToSave: Partial<Demande> = {
      ...this.demande,
      // S'assurer que les champs optionnels sont correctement définis
      dateValidation: this.demande.dateValidation || null,
      motifRejet: this.demande.motifRejet || null,
      documentsFournis: this.demande.documentsFournis || [],
      detailsComplementaires: this.demande.detailsComplementaires || ''
    };

    // Sauvegarder ou mettre à jour la demande
    const savedDemande = this.demandeService.saveDemande(demandeToSave as Demande);
    
    // Mettre à jour l'ID de la demande si c'est une nouvelle demande
    if (!this.demande.id && savedDemande) {
      this.demande.id = savedDemande.id;
      this.demande.numero = savedDemande.numero;
    }
    
    // Afficher un message de succès
    alert(`Demande ${this.isEditMode ? 'mise à jour' : 'créée'} avec succès !`);
    
    // Rediriger vers la liste des demandes ou les détails de la demande
    const redirectRoute = this.isEditMode ? ['/demande', this.demande.id] : ['/demandes'];
    this.router.navigate(redirectRoute);
  }

  addDocument(): void {
    if (!this.demande.documentsFournis) {
      this.demande.documentsFournis = [];
    }
    this.demande.documentsFournis.push('Nouveau document');
  }

  removeDocument(index: number): void {
    if (this.demande.documentsFournis && this.demande.documentsFournis.length > index) {
      this.demande.documentsFournis.splice(index, 1);
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.demande.id) {
      this.isEditMode = false;
      this.isViewMode = true;
      this.loadDemande(this.demande.id);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  onEdit(): void {
    this.isEditMode = true;
    this.isViewMode = false;
  }

  // Méthode utilitaire pour obtenir la classe d'icône en fonction du statut
  getStatusIcon(statut: StatutDemande | string | undefined): string {
    if (!statut) return 'fa-clock';
    
    const statutStr = statut.toString().toLowerCase();
    
    if (statutStr === StatutDemande.VALIDE.toLowerCase() || statutStr === 'validé') {
      return 'fa-check';
    } else if (statutStr === StatutDemande.EN_ATTENTE.toLowerCase() || statutStr === 'en attente' || statutStr === '') {
      return 'fa-clock';
    } else {
      return 'fa-times';
    }
  }

  // Méthode utilitaire pour formater le texte du statut
  getStatusText(statut: StatutDemande | string | undefined): string {
    if (!statut) return 'En attente';
    
    const statutStr = statut.toString().toLowerCase();
    
    if (statutStr === StatutDemande.VALIDE.toLowerCase() || statutStr === 'validé') {
      return 'Validé';
    } else if (statutStr === StatutDemande.EN_ATTENTE.toLowerCase() || statutStr === 'en attente') {
      return 'En attente';
    } else if (statutStr === StatutDemande.REJETE.toLowerCase() || statutStr === 'rejeté') {
      return 'Rejeté';
    } else if (statutStr === StatutDemande.TRAITE.toLowerCase() || statutStr === 'traité') {
      return 'Traité';
    } else {
      return statut.toString();
    }
  }
}
