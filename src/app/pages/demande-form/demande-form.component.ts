import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { StatusColorPipe } from '../../shared/pipes/status-color.pipe';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Demande,
  TypeDemande,
  StatutDemande,
  MotifDemande,
  FichierJoint,
  Destinataire,
  MarqueMoto,
  TypeMoto
} from '../../shared/models/demande.model';
import { DemandeService } from '../../shared/services/demande.service';
import { PdfService } from '../../shared/services/pdf.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    NgFor,
    NgClass,
    StatusColorPipe,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss'],
  providers: [
    DemandeService,
    PdfService,
    ToastrService
  ]
})
export class DemandeFormComponent implements OnInit {
  typePersonne: 'PHYSIQUE' | 'MORALE' | null = null;
  formPersonne!: FormGroup;
  formDemande!: FormGroup;
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  // Component state
  today: Date = new Date();
  isEditMode = false;
  isViewMode = false;
  isLoading = false;

  // Form data properties
  quantite = 0;
  prix = 0;
  typeVendeur = '';
  typeBeneficiaire = '';
  typeAcheteur = '';
  marquemoto = MarqueMoto.YAMAHA;
  typemoto = TypeMoto.Moto;
  detailsComplementaires = '';
  numero = '';
  dateSoumission = new Date();
  nomImportateur = '';
  adresseImportateur = '';

  // Form group for the demande form
  demandeForm: FormGroup;

  // Form arrays for dynamic fields
  get documents(): FormArray {
    return this.demandeForm.get('documents') as FormArray;
  }

  // Current demande being edited/viewed
  demande: Partial<Demande> = {};

  // File upload properties
  selectedFiles: File[] = [];

  // Mock data for testing
  private mockDemandes: any[] = [
    {
      id: 1,
      numero: 'DEM-001',
      type: TypeDemande.ACHAT,
      statut: StatutDemande.EN_ATTENTE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Fournisseur ABC',
      date: new Date(),
      dateSoumission: new Date(),
      quantiteMoto: 5,
      valeur: 2500000,
      marquemoto: MarqueMoto.YAMAHA,
      typemoto: TypeMoto.Moto,
      documentsFournis: [],
      utilisateurId: 1,
      dateCreation: new Date(),
      dateMiseAJour: new Date(),
      nom: 'Dupont',
      prenom: 'Jean',
      adresse: 'Ouagadougou',
      telephone: '12345678',
      // Valeurs par défaut pour les propriétés optionnelles
      raisonSociale: '',
      typeStructure: '',
      nomResponsable: '',
      nomImportateur: '',
      adresseImportateur: '',
      telephoneImportateur: '',
      emailImportateur: '',
      fichierJoint: FichierJoint.FACTURE
    },
    {
      id: 2,
      numero: 'DEM-002',
      type: TypeDemande.IMPORTATION,
      statut: StatutDemande.VALIDE,
      motif: MotifDemande.COMMERCE,
      emetteur: 'Import XYZ',
      date: new Date(),
      dateSoumission: new Date(),
      quantiteMoto: 10,
      valeur: 5000000,
      marquemoto: 'HONDA',
      typemoto: TypeMoto.Moto,
      documentsFournis: [],
      utilisateurId: 2,
      dateCreation: new Date(),
      dateMiseAJour: new Date(),
      raisonSociale: 'Import XYZ',
      typeStructure: 'AGENCE',
      nomResponsable: 'Martin',
      adresse: 'Bobo-Dioulasso',
      telephone: '87654321',
      // Valeurs par défaut pour les propriétés optionnelles
      nom: '',
      prenom: '',
      nomImportateur: '',
      adresseImportateur: '',
      telephoneImportateur: '',
      emailImportateur: '',
      fichierJoint: FichierJoint.FACTURE
    }
  ];

  // Enums for template access
  readonly TypeDemande = TypeDemande;
  readonly StatutDemande = StatutDemande;
  readonly MotifDemande = MotifDemande;
  readonly FichierJoint = FichierJoint;
  readonly Destinataire = Destinataire;
  readonly MarqueMoto = MarqueMoto;
  readonly TypeMoto = TypeMoto;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private demandeService: DemandeService,
    private pdfService: PdfService
  ) {
    this.demandeForm = this.fb.group({
      documents: this.fb.array([])
    });
  }

 ngOnInit(): void {
  this.formPersonne = this.fb.group({
    // Champs pour personne physique
    nom: ['', Validators.required],
    prenom: [''],
    adresse: ['', Validators.required],
    telephone: ['', Validators.required],
    // Champs pour personne morale
    raisonSociale: [''],
    typeStructure: [''], // Ajout de ce champ
    nomResponsable: [''], // Ajout de ce champ
    registreCommerce: [''],
    adresseMorale: [''],
    telephoneMorale: ['']
  });

  this.formDemande = this.fb.group({
    type: ['', Validators.required],
    destinataire: ['', Validators.required],
    motif: ['', Validators.required],
    fichierJoint: ['', Validators.required],
    typemoto: ['', Validators.required],
    marquemoto: ['', Validators.required],
    quantite: ['', Validators.required],
    prix: ['', Validators.required],
    // Champs additionnels
    nomImportateur: [''],
    emailImportateur: [''],
    adresseImportateur: [''],
    telephoneImportateur: [''],
    nomVendeur: [''],
    typeVendeur: [''],
    telephoneVendeur: [''],
    emailVendeur: [''],
    nomBeneficiaire: [''],
    typeBeneficiaire: [''],
    adresseBeneficiaire: [''],
    telephoneBeneficiaire: [''],
    nomDonateur: [''],
    typeDonateur: [''],
    adresseDonateur: [''],
    telephoneDonateur: [''],
    nomAcheteur: [''],
    typeAcheteur: [''],
    adresseAcheteur: [''],
    telephoneAcheteur: [''],
    emailAcheteur: [''],
    detailsComplementaires: [''],
    documentsFournis: this.fb.array([])
  });

  // Chargement du mode (view/edit) et de la demande si besoin
  const id = this.route.snapshot.paramMap.get('id');
  const mode = this.route.snapshot.url[0]?.path;
  if (mode === 'view') {
    this.isViewMode = true;
    this.formDemande.disable();
  } else if (mode === 'edit') {
    this.isEditMode = true;
  }
  if (id) {
    this.loadDemande(+id);
  }
}

 choisirType(type: 'PHYSIQUE' | 'MORALE') {
  this.typePersonne = type;

  // Réinitialiser les validateurs
  this.formPersonne.get('nom')?.clearValidators();
  this.formPersonne.get('prenom')?.clearValidators();
  this.formPersonne.get('adresse')?.clearValidators();
  this.formPersonne.get('telephone')?.clearValidators();
  this.formPersonne.get('raisonSociale')?.clearValidators();
  this.formPersonne.get('typeStructure')?.clearValidators();
  this.formPersonne.get('nomResponsable')?.clearValidators();
  this.formPersonne.get('adresseMorale')?.clearValidators();
  this.formPersonne.get('telephoneMorale')?.clearValidators();

  // Mettre à jour les validateurs selon le type
  if (type === 'PHYSIQUE') {
    this.formPersonne.get('nom')?.setValidators(Validators.required);
    this.formPersonne.get('adresse')?.setValidators(Validators.required);
    this.formPersonne.get('telephone')?.setValidators(Validators.required);
  } else {
    this.formPersonne.get('raisonSociale')?.setValidators(Validators.required);
    this.formPersonne.get('adresseMorale')?.setValidators(Validators.required);
    this.formPersonne.get('telephoneMorale')?.setValidators(Validators.required);
  }

  // Mettre à jour la validité des champs
  this.formPersonne.get('nom')?.updateValueAndValidity();
  this.formPersonne.get('prenom')?.updateValueAndValidity();
  this.formPersonne.get('adresse')?.updateValueAndValidity();
  this.formPersonne.get('telephone')?.updateValueAndValidity();
  this.formPersonne.get('raisonSociale')?.updateValueAndValidity();
  this.formPersonne.get('typeStructure')?.updateValueAndValidity();
  this.formPersonne.get('nomResponsable')?.updateValueAndValidity();
  this.formPersonne.get('adresseMorale')?.updateValueAndValidity();
  this.formPersonne.get('telephoneMorale')?.updateValueAndValidity();
}

  get documentsFournis(): FormArray {
    return this.formDemande.get('documentsFournis') as FormArray;
  }

  addDocument() {
    this.documentsFournis.push(this.fb.control(''));
  }

  removeDocument(index: number) {
    this.documentsFournis.removeAt(index);
  }

  // File upload methods
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
      this.toastr.success(`${files.length} fichier(s) ajouté(s)`);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  getFileName(file: File): string {
    return file.name;
  }

  getFileSize(size: number): string {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }

  // Méthode pour générer un numéro de dossier
  generateNumero(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEM-${year}${month}${day}-${random}`;
  }

 onSubmit() {
  if (this.formPersonne.invalid || this.formDemande.invalid) {
    this.toastr.error('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  this.isLoading = true;

  // Fusionner les données des formulaires
  const personneData = this.formPersonne.value;
  const demandeData = this.formDemande.value;

  // Créer l'objet demande complet
  const newId = this.mockDemandes.length > 0 ? Math.max(...this.mockDemandes.map(d => d.id)) + 1 : 1;

  // Créer un objet de base pour la demande
  const completeDemande: any = {
    id: newId,
    ...demandeData,
    numero: this.generateNumero(),
    dateSoumission: new Date(),
    statut: StatutDemande.EN_ATTENTE,
    quantiteMoto: demandeData.quantite,
    valeur: demandeData.prix,
    marquemoto: demandeData.marquemoto,
    typemoto: demandeData.typemoto,
    documentsFournis: demandeData.documentsFournis,
    // Ajouter les informations de la personne selon le type
    ...(this.typePersonne === 'PHYSIQUE' ? {
      nom: personneData.nom,
      prenom: personneData.prenom,
      adresse: personneData.adresse,
      telephone: personneData.telephone,
      // Valeurs par défaut pour les propriétés de structure
      raisonSociale: '',
      registreCommerce: '',
      typeStructure: '',
      nomResponsable: ''
    } : {
      raisonSociale: personneData.raisonSociale || '',
      registreCommerce: personneData.registreCommerce || '',
      adresse: personneData.adresseMorale || '',
      telephone: personneData.telephoneMorale || '',
      // Valeurs par défaut pour les propriétés de personne physique
      nom: '',
      prenom: '',
      typeStructure: personneData.typeStructure || '',
      nomResponsable: personneData.nomResponsable || ''
    })
  };

  // Ajouter les fichiers sélectionnés à la demande
  if (this.selectedFiles.length > 0) {
    completeDemande.fichiers = this.selectedFiles.map(file => ({
      nom: file.name,
      taille: file.size,
      type: file.type
    }));
  }

  // S'assurer que toutes les propriétés requises sont présentes
  if (!completeDemande.emetteur) {
    completeDemande.emetteur = this.typePersonne === 'PHYSIQUE'
      ? `${personneData.nom} ${personneData.prenom}`
      : personneData.raisonSociale;
  }

  if (!completeDemande.destinataire) {
    completeDemande.destinataire = Destinataire.MICA;
  }

  if (!completeDemande.utilisateurId) {
    completeDemande.utilisateurId = 1; // Valeur par défaut
  }

  if (!completeDemande.dateCreation) {
    completeDemande.dateCreation = new Date();
  }

  if (!completeDemande.dateMiseAJour) {
    completeDemande.dateMiseAJour = new Date();
  }

  // Simuler un délai réseau
  setTimeout(() => {
    // Ajouter à la liste locale
    this.mockDemandes.push(completeDemande);

    this.isLoading = false;
    this.toastr.success('Demande soumise avec succès !');

    // Afficher le numéro de dossier généré
    this.toastr.info(`Votre numéro de dossier est: ${completeDemande.numero}`);

    // Rediriger vers la page de suivi
    this.router.navigate(['/demandes/suivi']);
  }, 1000);
}

  loadDemande(id: number): void {
  this.isLoading = true;

  // Simuler un délai réseau
  setTimeout(() => {
    const demande = this.mockDemandes.find(d => d.id === id);

    if (demande) {
      this.demande = demande;
      this.formDemande.patchValue(demande);

      // Déterminer le type de personne
      if (demande.raisonSociale) {
        this.typePersonne = 'MORALE';
        this.formPersonne.patchValue({
          raisonSociale: demande.raisonSociale,
          typeStructure: demande.typeStructure || '',
          nomResponsable: demande.nomResponsable || '',
          registreCommerce: demande.registreCommerce || '',
          adresseMorale: demande.adresse,
          telephoneMorale: demande.telephone
        });
      } else {
        this.typePersonne = 'PHYSIQUE';
        this.formPersonne.patchValue({
          nom: demande.nom,
          prenom: demande.prenom,
          adresse: demande.adresse,
          telephone: demande.telephone
        });
      }

      // Mettre à jour les validateurs selon le type de personne
      this.choisirType(this.typePersonne!);
    } else {
      this.toastr.error('Demande non trouvée');
    }

    this.isLoading = false;
  }, 500);
}

  onCancel(): void {
    if (confirm('Voulez-vous vraiment annuler les modifications ?')) {
      if (this.demande.id) {
        this.loadDemande(this.demande.id);
      } else {
        this.router.navigate(['/demandes']);
      }
    }
  }

  // Méthode pour générer et afficher l'autorisation PDF
  async voirAutorisation(): Promise<void> {
    if (!this.demande.id) {
      console.error('ID de demande manquant');
      alert('Impossible de générer le PDF : ID de demande manquant');
      return;
    }
    try {
      console.log('Début de la génération du PDF...');
      this.isLoading = true;
      // Attendre que la vue soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 300));
      // Vérifier que l'élément existe
      if (!this.pdfContent || !this.pdfContent.nativeElement) {
        throw new Error('Élément PDF non trouvé dans le DOM');
      }
      const content = this.pdfContent.nativeElement;
      console.log('Élément PDF trouvé', content);
      // Créer un clone de l'élément pour éviter les problèmes de style
      const clonedContent = content.cloneNode(true);
      clonedContent.style.display = 'block'; // S'assurer que le contenu est visible
      document.body.appendChild(clonedContent);
      try {
        console.log('Génération du canvas...');
        const canvas = await html2canvas(clonedContent as HTMLElement, {
          scale: 1, // Réduire la qualité pour le débogage
          useCORS: true,
          allowTaint: true,
          logging: true, // Activer les logs pour le débogage
          backgroundColor: '#FFFFFF',
          onclone: (clonedDoc, element) => {
            // S'assurer que le contenu est visible lors du clonage
            (element as HTMLElement).style.display = 'block';
            (element as HTMLElement).style.visibility = 'visible';
          }
        });
        console.log('Création du PDF...');
        const pdf = new jsPDF('p', 'mm', 'a4');
        try {
          const imgData = canvas.toDataURL('image/png');
          console.log('Données de l\'image générées', imgData.substring(0, 50) + '...');
          // Calculer les dimensions pour que l'image tienne sur la page A4
          const imgWidth = 210; // Largeur A4 en mm
          const pageHeight = 295; // Hauteur A4 en mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          console.log(`Dimensions du canvas: ${canvas.width}x${canvas.height}`);
          console.log(`Dimensions du PDF: ${imgWidth}x${imgHeight}mm`);
          // Ajouter la première page
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
          console.log('Enregistrement du PDF...');
          // Télécharger le PDF
          const fileName = `autorisation-${this.demande.numero || this.demande.id}.pdf`;
          pdf.save(fileName);
          console.log(`PDF enregistré sous le nom: ${fileName}`);
        } catch (error: any) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          console.error('Erreur lors de la création de l\'image:', error);
          throw new Error(`Échec de la création de l'image: ${errorMessage}`);
        }
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('Erreur lors de la création du canvas:', error);
        throw new Error(`Échec de la création du canvas: ${errorMessage}`);
      } finally {
        // Nettoyer le clone
        if (document.body.contains(clonedContent)) {
          document.body.removeChild(clonedContent);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la génération du PDF:', error);
      alert(`Erreur lors de la génération du PDF: ${errorMessage}`);
    } finally {
      this.isLoading = false;
    }
  }

  onEdit(): void {
    this.isEditMode = true;
    this.isViewMode = false;
  }

  // Status helpers
  getStatusIcon(statut: StatutDemande | string | undefined): string {
    if (!statut) return 'help';
    switch (statut) {
      case StatutDemande.VALIDE:
        return 'check_circle';
      case StatutDemande.REJETE:
        return 'cancel';
      case StatutDemande.EN_ATTENTE:
        return 'schedule';
      case StatutDemande.TRAITE:
        return 'done_all';
      default:
        return 'help';
    }
  }

  getStatusText(statut: StatutDemande | string | undefined): string {
    if (!statut) return 'Inconnu';
    switch (statut) {
      case StatutDemande.VALIDE:
        return 'Validé';
      case StatutDemande.REJETE:
        return 'Rejeté';
      case StatutDemande.EN_ATTENTE:
        return 'En attente';
      case StatutDemande.TRAITE:
        return 'Traité';
      default:
        return statut;
    }
  }

  getStatusClass(statut: StatutDemande | string | undefined): string {
    if (!statut) return 'badge-secondary';
    switch (statut) {
      case StatutDemande.VALIDE:
        return 'badge-success';
      case StatutDemande.REJETE:
        return 'badge-danger';
      case StatutDemande.EN_ATTENTE:
        return 'badge-warning';
      case StatutDemande.TRAITE:
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }
}
