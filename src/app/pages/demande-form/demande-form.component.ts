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
} 
from '../../shared/models/demande.model';
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
      // Form controls will be added here
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

  onSubmit() {
    if (this.formPersonne.invalid || this.formDemande.invalid) {
      this.toastr.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const personne = this.formPersonne.value;
    const demande = this.formDemande.value;
    // Ici, tu peux fusionner les infos et envoyer au backend
    // ...
    this.toastr.success('Demande soumise avec succès !');
  }

  loadDemande(id: number): void {
    this.isLoading = true;

    // Simuler à partir de tes fausses données
    const mockData = [
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
        // autres champs à compléter

      },
      {
        id: 2,
        numero: 'DEM-002',
        type: TypeDemande.ACHAT,
        statut: StatutDemande.VALIDE,
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
        // autres champs à compléter
      },
      {
        id: 3,
        numero: 'DEM-003',
        type: TypeDemande.ACHAT,
        statut: StatutDemande.REJETE,
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
        // autres champs à compléter
      },
      // etc.
    ];

    const found = mockData.find(d => d.id === id);
    if (found) {
      this.demande = found;
      this.demandeForm.patchValue(found);
    }
    this.isLoading = false;
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
