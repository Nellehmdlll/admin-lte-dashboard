import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DemandeFormService } from '../../services/demande-form.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Simple pipe pour les couleurs de statut (inline)
export function getStatusClass(statut: string | undefined): string {
  switch (statut) {
    case 'VALIDE': return 'badge-success';
    case 'REJETE': return 'badge-danger';
    case 'EN_ATTENTE': return 'badge-warning';
    case 'TRAITE': return 'badge-info';
    default: return 'badge-secondary';
  }
}

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
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss']
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

  // Current demande being edited/viewed
  demande: any = {};

  // File upload properties
  selectedFiles: File[] = [];

  // Options pour les templates
  readonly typesDemandeOptions = ['IMPORTATION', 'ACHAT', 'VENTE', 'DON'];
  readonly statutsOptions = ['EN_ATTENTE', 'VALIDE', 'REJETE', 'TRAITE'];
  readonly motifsOptions = ['COMMERCE', 'PERSONNEL', 'PROFESSIONNEL', 'AUTRE'];
  readonly fichiersJointsOptions = ['FACTURE', 'BON_COMMANDE', 'CONTRAT', 'AUTRE'];
  readonly destinatairesOptions = ['MINISTERE_TRANSPORT', 'DOUANES', 'COMMERCE'];
  readonly marquesMotosOptions = ['YAMAHA', 'HONDA', 'SUZUKI', 'KAWASAKI', 'AUTRE'];
  readonly typesMotosOptions = ['Moto', 'Scooter', 'Tricycle'];

  // Pour rétro-compatibilité avec le HTML existant
  readonly TypeDemande = { IMPORTATION: 'IMPORTATION', ACHAT: 'ACHAT', VENTE: 'VENTE', DON: 'DON' };
  readonly StatutDemande = { EN_ATTENTE: 'EN_ATTENTE', VALIDE: 'VALIDE', REJETE: 'REJETE', TRAITE: 'TRAITE' };
  readonly MotifDemande = { COMMERCE: 'COMMERCE', PERSONNEL: 'PERSONNEL', PROFESSIONNEL: 'PROFESSIONNEL', AUTRE: 'AUTRE' };
  readonly FichierJoint = { FACTURE: 'FACTURE', BON_COMMANDE: 'BON_COMMANDE', CONTRAT: 'CONTRAT', AUTRE: 'AUTRE' };
  readonly Destinataire = { MINISTERE_TRANSPORT: 'MINISTERE_TRANSPORT', DOUANES: 'DOUANES', COMMERCE: 'COMMERCE' };
  readonly MarqueMoto = { YAMAHA: 'YAMAHA', HONDA: 'HONDA', SUZUKI: 'SUZUKI', KAWASAKI: 'KAWASAKI', AUTRE: 'AUTRE' };
  readonly TypeMoto = { Moto: 'Moto', Scooter: 'Scooter', Tricycle: 'Tricycle' };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private demandeFormService: DemandeFormService
  ) {}

  ngOnInit(): void {
    // Utiliser le service pour créer les formulaires
    this.formPersonne = this.demandeFormService.createPersonneForm();
    this.formDemande = this.demandeFormService.createDemandeForm();

    // S'abonner au loading state du service
    this.demandeFormService.loading$.subscribe(loading => {
      this.isLoading = loading;
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
    // Utiliser le service pour mettre à jour les validateurs
    this.demandeFormService.updatePersonneValidators(this.formPersonne, type);
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
      alert(`${files.length} fichier(s) ajouté(s)`);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  getFileName(file: File): string {
    return file.name;
  }

  getFileSize(size: number): string {
    // Simple méthode pour la taille des fichiers
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }

  onSubmit() {
    if (this.formPersonne.invalid || this.formDemande.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const personneData = this.formPersonne.value;
    const demandeData = this.formDemande.value;

    if (this.isEditMode && this.demande.id) {
      // Mode édition - utiliser updateDemande
      this.demandeFormService.updateDemande(this.demande.id, {
        ...personneData,
        ...demandeData,
        type_personne: this.typePersonne
      }).subscribe({
        next: (response) => {
          alert('Demande mise à jour avec succès !');
          this.router.navigate(['/demandes/suivi']);
        },
        error: (error) => {
          alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message));
        }
      });
    } else {
      // Mode création - utiliser createDemande du service
      this.demandeFormService.createDemande(personneData, demandeData, this.typePersonne!).subscribe({
        next: (response) => {
          alert('Demande créée avec succès !');



          if (response.data?.numero) {
            alert(`Votre numéro de dossier est: ${response.data.numero}`);
          }

          // Upload des fichiers si présents
          if (this.selectedFiles.length > 0) {
            this.demandeFormService.uploadFiles(this.selectedFiles).subscribe({
              next: () => {
                alert('Fichiers uploadés avec succès !');
              },
              error: (error) => {
                alert('Fichiers non uploadés: ' + (error.error?.message || error.message));
              }
            });
          }

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          alert('Erreur lors de la création: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  loadDemande(id: number): void {
    // Utiliser le service pour charger la demande
    this.demandeFormService.loadDemande(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.demande = response.data;

          // Patcher les formulaires avec les données
          this.formDemande.patchValue({
            type: response.data.type,
            destinataire: response.data.destinataire,
            motif: response.data.motif,
            fichierJoint: response.data.fichier_joint,
            typemoto: response.data.type_moto,
            marquemoto: response.data.marque_moto,
            quantite: response.data.quantite,
            prix: response.data.prix,
            nomImportateur: response.data.nom_importateur,
            emailImportateur: response.data.email_importateur,
            adresseImportateur: response.data.adresse_importateur,
            telephoneImportateur: response.data.telephone_importateur,
            nomVendeur: response.data.nom_vendeur,
            typeVendeur: response.data.type_vendeur,
            telephoneVendeur: response.data.telephone_vendeur,
            emailVendeur: response.data.email_vendeur,
            nomBeneficiaire: response.data.nom_beneficiaire,
            typeBeneficiaire: response.data.type_beneficiaire,
            adresseBeneficiaire: response.data.adresse_beneficiaire,
            telephoneBeneficiaire: response.data.telephone_beneficiaire,
            nomAcheteur: response.data.nom_acheteur,
            typeAcheteur: response.data.type_acheteur,
            adresseAcheteur: response.data.adresse_acheteur,
            telephoneAcheteur: response.data.telephone_acheteur,
            emailAcheteur: response.data.email_acheteur,
            detailsComplementaires: response.data.details_complementaires
          });

          // Déterminer le type de personne et patcher les données
          if (response.data.raison_sociale) {
            this.typePersonne = 'MORALE';
            this.formPersonne.patchValue({
              raisonSociale: response.data.raison_sociale,
              registreCommerce: response.data.registre_commerce,
              adresseMorale: response.data.adresse_morale || response.data.adresse,
              telephoneMorale: response.data.telephone_morale || response.data.telephone
            });
          } else {
            this.typePersonne = 'PHYSIQUE';
            this.formPersonne.patchValue({
              nom: response.data.nom,
              prenom: response.data.prenom,
              adresse: response.data.adresse,
              telephone: response.data.telephone
            });
          }

          // Mettre à jour les validateurs
          if (this.typePersonne) {
            this.choisirType(this.typePersonne);
          }
        }
      },
      error: (error) => {
        alert('Erreur lors du chargement: ' + (error.error?.message || error.message));
      }
    });
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

  // Méthode pour générer et afficher l'autorisation PDF (simplifiée)
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

      if (!this.pdfContent || !this.pdfContent.nativeElement) {
        throw new Error('Élément PDF non trouvé dans le DOM');
      }

      const content = this.pdfContent.nativeElement;

      // Générer le canvas
      const canvas = await html2canvas(content, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });

      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const fileName = `autorisation-${this.demande.numero || this.demande.id}.pdf`;
      pdf.save(fileName);

      console.log(`PDF enregistré sous le nom: ${fileName}`);

    } catch (error: any) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert(`Erreur lors de la génération du PDF: ${error.message || 'Erreur inconnue'}`);
    } finally {
      this.isLoading = false;
    }
  }

  onEdit(): void {
    this.isEditMode = true;
    this.isViewMode = false;
  }

  // Status helpers - méthodes simples
  getStatusIcon(statut: string | undefined): string {
    switch (statut) {
      case 'VALIDE': return 'check_circle';
      case 'REJETE': return 'cancel';
      case 'EN_ATTENTE': return 'schedule';
      case 'TRAITE': return 'done_all';
      default: return 'help';
    }
  }

  getStatusText(statut: string | undefined): string {
    switch (statut) {
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      case 'EN_ATTENTE': return 'En attente';
      case 'TRAITE': return 'Traité';
      default: return 'Inconnu';
    }
  }

  getStatusClass(statut: string | undefined): string {
    return getStatusClass(statut);
  }
}
