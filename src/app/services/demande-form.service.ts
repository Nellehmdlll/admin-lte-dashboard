import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemandeFormService {
  private apiUrl = 'http://localhost:8000/api';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  // Méthode pour obtenir les en-têtes avec le token
  private getHttpHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Méthode pour les en-têtes avec FormData (upload de fichiers)
  private getFormDataHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    let headers = new HttpHeaders({
      'Accept': 'application/json'
      // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Création des formulaires
  createPersonneForm(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      prenom: [''],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      raisonSociale: [''],
      typeStructure: [''],
      nomResponsable: [''],
      registreCommerce: [''],
      adresseMorale: [''],
      telephoneMorale: ['']
    });
  }

  createDemandeForm(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      destinataire: ['', Validators.required],
      motif: ['', Validators.required],
      fichierJoint: ['', Validators.required],
      typemoto: ['', Validators.required],
      marquemoto: ['', Validators.required],
      quantite: ['', Validators.required],
      prix: ['', Validators.required],
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
  }

  // Gestion des validateurs selon le type de personne
  updatePersonneValidators(form: FormGroup, type: 'PHYSIQUE' | 'MORALE'): void {
    // Reset validateurs
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.clearValidators();
    });

    if (type === 'PHYSIQUE') {
      form.get('nom')?.setValidators(Validators.required);
      form.get('adresse')?.setValidators(Validators.required);
      form.get('telephone')?.setValidators(Validators.required);
    } else {
      form.get('raisonSociale')?.setValidators(Validators.required);
      form.get('adresseMorale')?.setValidators(Validators.required);
      form.get('telephoneMorale')?.setValidators(Validators.required);
    }

    // Update validity
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.updateValueAndValidity();
    });
  }

  // Génération du numéro de dossier
  generateNumero(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(3, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEM-${year}${month}${day}-${random}`;
  }

  // Création d'une demande
  createDemande(personneData: any, demandeData: any, typePersonne: 'PHYSIQUE' | 'MORALE'): Observable<any> {
    this.loadingSubject.next(true);

    // Aplatir les données selon le format attendu par l'API
    const payload = {
      // Type de personne
      type_personne: typePersonne,

      // Informations personne (selon le type)
      ...(typePersonne === 'PHYSIQUE' ? {
        nom: personneData.nom,
        prenom: personneData.prenom,
        adresse: personneData.adresse,
        telephone: personneData.telephone
      } : {
        raison_sociale: personneData.raisonSociale,
        registre_commerce: personneData.registreCommerce,
        adresse_morale: personneData.adresseMorale,
        telephone_morale: personneData.telephoneMorale
      }),

      // Informations demande (mapper les noms)
      type: demandeData.type,
      destinataire: demandeData.destinataire,
      motif: demandeData.motif,
      fichier_joint: demandeData.fichierJoint,
      type_moto: demandeData.typemoto,
      marque_moto: demandeData.marquemoto,
      quantite: demandeData.quantite,
      prix: demandeData.prix,

      // Champs optionnels
      nom_importateur: demandeData.nomImportateur,
      email_importateur: demandeData.emailImportateur,
      adresse_importateur: demandeData.adresseImportateur,
      telephone_importateur: demandeData.telephoneImportateur,
      nom_vendeur: demandeData.nomVendeur,
      type_vendeur: demandeData.typeVendeur,
      telephone_vendeur: demandeData.telephoneVendeur,
      email_vendeur: demandeData.emailVendeur,
      nom_beneficiaire: demandeData.nomBeneficiaire,
      type_beneficiaire: demandeData.typeBeneficiaire,
      adresse_beneficiaire: demandeData.adresseBeneficiaire,
      telephone_beneficiaire: demandeData.telephoneBeneficiaire,
      nom_acheteur: demandeData.nomAcheteur,
      type_acheteur: demandeData.typeAcheteur,
      adresse_acheteur: demandeData.adresseAcheteur,
      telephone_acheteur: demandeData.telephoneAcheteur,
      email_acheteur: demandeData.emailAcheteur,
      details_complementaires: demandeData.detailsComplementaires,
      documents_fournis: demandeData.documentsFournis
    };

    return this.http.post(`${this.apiUrl}/demandes`, payload, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur création demande:', error);

        // Si erreur d'authentification, rediriger vers login
        if (error.status === 401) {
          this.handleAuthenticationError();
        }

        throw error;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Chargement d'une demande
  loadDemande(id: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.http.get(`${this.apiUrl}/demandes/${id}`, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur chargement demande:', error);

        if (error.status === 401) {
          this.handleAuthenticationError();
        }

        throw error;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Mise à jour d'une demande
  updateDemande(id: number, data: any): Observable<any> {
    this.loadingSubject.next(true);

    return this.http.put(`${this.apiUrl}/demandes/${id}`, data, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur mise à jour demande:', error);

        if (error.status === 401) {
          this.handleAuthenticationError();
        }

        throw error;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Liste des demandes
  getDemandes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/demandes`, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        throw error;
      })
    );
  }

  // Upload de fichiers
  uploadFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('fichiers[]', file));

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: this.getFormDataHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        throw error;
      })
    );
  }

  // Validation d'une demande (pour admin/validateur)
  validerDemande(id: number, statut: string, commentaire?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/demandes/${id}/valider`, {
      statut,
      commentaire_validation: commentaire
    }, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        throw error;
      })
    );
  }

  // Supprimer un document
  supprimerDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}`, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        throw error;
      })
    );
  }

  // Télécharger un document
  telechargerDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${documentId}/download`, {
      responseType: 'blob',
      headers: this.getFormDataHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        throw error;
      })
    );
  }

  // Statistiques
  getStatistiques(): Observable<any> {
    return this.http.get(`${this.apiUrl}/demandes/statistiques`, {
      headers: this.getHttpHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.handleAuthenticationError();
        }
        throw error;
      })
    );
  }

  // Gestion des erreurs d'authentification
  private handleAuthenticationError(): void {
    // Supprimer les tokens expirés
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('user_data');

    // Rediriger vers la page de login
    window.location.href = '/login';

    // Ou utiliser Router si disponible
    // this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  }

  // Obtenir le token actuel
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Gestion des fichiers
  processFiles(files: File[]): { nom: string; taille: number; type: string }[] {
    return files.map(file => ({
      nom: file.name,
      taille: file.size,
      type: file.type
    }));
  }

  // Utilitaires pour les templates
  getStatusInfo(statut: string | undefined): { icon: string; text: string; class: string } {
    switch (statut) {
      case 'VALIDE':
        return { icon: 'check_circle', text: 'Validé', class: 'badge-success' };
      case 'REJETE':
        return { icon: 'cancel', text: 'Rejeté', class: 'badge-danger' };
      case 'EN_ATTENTE':
        return { icon: 'schedule', text: 'En attente', class: 'badge-warning' };
      case 'TRAITE':
        return { icon: 'done_all', text: 'Traité', class: 'badge-info' };
      default:
        return { icon: 'help', text: 'Inconnu', class: 'badge-secondary' };
    }
  }

  // Utilitaires pour les fichiers
  getFileSize(size: number): string {
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
