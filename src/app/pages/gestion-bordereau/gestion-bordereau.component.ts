import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface FichierBordereau {
  nom: string;
  type: 'image' | 'pdf' | 'autre';
  url: string;
  dateUpload: Date;
  taille: string;
}

interface Bordereau {
  id: string;
  numero: string;
  dateCreation: Date;
  statut: 'en_attente' | 'valide' | 'rejete';
  demande: {
    id: string;
    numero: string;
    type: string;
    dateSoumission: Date;
    demandeur: {
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
    };
    vehicule: {
      marque: string;
      modele: string;
      annee: number;
      numeroSerie: string;
    };
  };
  fichier: FichierBordereau;
  motifRejet?: string;
}

@Component({
  selector: 'app-gestion-bordereau',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgClass, NgIf, NgFor, DatePipe],
  templateUrl: './gestion-bordereau.component.html',
  styleUrls: ['./gestion-bordereau.component.scss']
})
export class GestionBordereauComponent implements OnInit, OnDestroy {
  // Liste des bordereaux
  bordereaux: Bordereau[] = [];

  // Filtres et recherche
  searchTerm: string = '';
  filtreStatut: string = 'tous';

  // Pagination
  pageCourante: number = 1;
  elementsParPage: number = 10;

  // Bordereau sélectionné
  bordereauSelectionne: Bordereau | null = null;

  // Gestion du modal de rejet
  showRejectModal: boolean = false;
  motifRejet: string = '';

  // État de chargement
  isLoading: boolean = false;
Math: any;

  // Propriétés calculées pour les statistiques
  get bordereauxValidesCount(): number {
    return this.bordereaux.filter(b => b.statut === 'valide').length;
  }

  get bordereauxEnAttenteCount(): number {
    return this.bordereaux.filter(b => b.statut === 'en_attente').length;
  }

  get bordereauxRejetesCount(): number {
    return this.bordereaux.filter(b => b.statut === 'rejete').length;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  private subscription: any;
  
  ngOnInit(): void {
    this.Math = Math;
    
    // S'abonner aux changements de paramètres de route
    this.subscription = this.route.paramMap.subscribe(params => {
      const bordereauId = params.get('id');
      console.log('ID du bordereau depuis l\'URL:', bordereauId);
      
      if (bordereauId) {
        // Si on a un ID, on charge les détails après le chargement des bordereaux
        this.chargerBordereaux().subscribe({
          next: () => {
            this.chargerBordereauParId(bordereauId);
          },
          error: (error) => {
            console.error('Erreur lors du chargement des bordereaux:', error);
            this.toastr.error('Erreur lors du chargement des bordereaux', 'Erreur');
          }
        });
      } else {
        // Sinon, on charge simplement la liste
        this.chargerBordereaux().subscribe({
          error: (error) => {
            console.error('Erreur lors du chargement des bordereaux:', error);
            this.toastr.error('Erreur lors du chargement des bordereaux', 'Erreur');
          }
        });
      }
    });
  }
  
  ngOnDestroy(): void {
    // Nettoyer les abonnements pour éviter les fuites de mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Charge un bordereau par son ID
  private chargerBordereauParId(bordereauId: string): void {
    const bordereau = this.bordereaux.find(b => b.id === bordereauId);
    if (bordereau) {
      this.ouvrirDetails(bordereau);
    } else {
      this.toastr.warning('Bordereau non trouvé', 'Attention');
      this.router.navigate(['/bordereaux']);
    }
  }

  // Charge la liste des bordereaux (simulé pour l'instant)
  chargerBordereaux(): Observable<void> {
    console.log('Début du chargement des bordereaux...');
    this.isLoading = true;
    return new Observable<void>((observer) => {
      // Simulation de chargement asynchrone
      setTimeout(() => {
        try {
          console.log('Génération des données d\'exemple...');
          const donnees = this.genererDonneesExemple();
          console.log('Données générées:', donnees);
          this.bordereaux = donnees;
          console.log('Bordereaux chargés:', this.bordereaux);
          this.isLoading = false;
          console.log('Chargement terminé, isLoading:', this.isLoading);
          observer.next();
          observer.complete();
        } catch (error) {
          console.error('Erreur lors du chargement des bordereaux:', error);
          this.isLoading = false;
          observer.error(error);
        }
      }, 500);
    });
  }

  // Filtre les bordereaux selon les critères de recherche
  get bordereauxFiltres(): Bordereau[] {
    console.log('Filtrage des bordereaux...');
    console.log('Terme de recherche:', this.searchTerm);
    console.log('Filtre de statut:', this.filtreStatut);
    console.log('Nombre total de bordereaux:', this.bordereaux.length);
    
    const resultats = this.bordereaux.filter(bordereau => {
      try {
        // Filtre par terme de recherche
        const correspondRecherche = !this.searchTerm || 
          bordereau.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          bordereau.demande.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          bordereau.demande.demandeur.nom.toLowerCase().includes(this.searchTerm.toLowerCase());

        // Filtre par statut
        const correspondStatut =
          this.filtreStatut === 'tous' ||
          (this.filtreStatut === 'en_attente' && bordereau.statut === 'en_attente') ||
          (this.filtreStatut === 'valide' && bordereau.statut === 'valide') ||
          (this.filtreStatut === 'rejete' && bordereau.statut === 'rejete');

        return correspondRecherche && correspondStatut;
      } catch (error) {
        console.error('Erreur lors du filtrage d\'un bordereau:', error, bordereau);
        return false;
      }
    });
    
    console.log('Résultats du filtrage:', resultats.length, 'bordereaux trouvés');
    return resultats;
  }

  // Obtient les bordereaux pour la page courante
  get bordereauxPagination(): Bordereau[] {
    if (!this.bordereauxFiltres || this.bordereauxFiltres.length === 0) {
      return [];
    }
    
    const startIndex = (this.pageCourante - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    const paginated = this.bordereauxFiltres.slice(startIndex, endIndex);
    
    console.log(`Pagination: page ${this.pageCourante}, affichage des éléments ${startIndex + 1} à ${Math.min(endIndex, this.bordereauxFiltres.length)} sur ${this.bordereauxFiltres.length}`);
    console.log('Éléments paginés:', paginated);
    
    return paginated;
  }

  // Change de page
  changerPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.pageCourante = page;
      console.log(`Changement de page vers: ${page}`);
    } else if (page === 'prev' && this.pageCourante > 1) {
      this.pageCourante--;
      console.log(`Page précédente: ${this.pageCourante}`);
    } else if (page === 'next' && this.pageCourante < this.totalPages) {
      this.pageCourante++;
      console.log(`Page suivante: ${this.pageCourante}`);
    }
  }
  
  // Obtient le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.bordereauxFiltres.length / this.elementsParPage);
  }

  // Génère la liste des numéros de page pour la pagination
  getPages(): (number | string)[] {
    const totalPages = Math.ceil(this.bordereauxFiltres.length / this.elementsParPage);
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5; // Nombre maximum de boutons de page à afficher
    
    if (totalPages <= maxPagesToShow) {
      // Si moins de pages que le maximum à afficher, on les montre toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sinon, on utilise une pagination avec des points de suspension
      pages.push(1); // Première page
      
      // Calcul des pages autour de la page courante
      let startPage = Math.max(2, this.pageCourante - 1);
      let endPage = Math.min(totalPages - 1, this.pageCourante + 1);
      
      // Ajustement pour s'assurer qu'on affiche toujours le même nombre de boutons
      if (this.pageCourante <= 3) {
        endPage = 4;
      } else if (this.pageCourante >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Ajout des points de suspension si nécessaire
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Ajout des pages autour de la page courante
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Ajout des points de suspension si nécessaire
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages); // Dernière page (si différente de la première)
      }
    }
    
    return pages;
  }

  // Ouvre les détails d'un bordereau
  ouvrirDetails(bordereau: Bordereau): void {
    this.bordereauSelectionne = bordereau;
    // Mettre à jour l'URL pour refléter l'ID du bordereau
    this.router.navigate(['/bordereaux', bordereau.id], {
      relativeTo: this.route.parent
    });
  }

  // Retourne à la page précédente ou à la liste des bordereaux
  retourPrecedent(): void {
    if (this.bordereauSelectionne) {
      this.fermerDetails();
    } else {
      // Si on est déjà sur la liste, on retourne au tableau de bord
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // Ferme les détails
  fermerDetails(): void {
    this.bordereauSelectionne = null;
    // Nettoyer l'URL lors de la fermeture
    this.router.navigate(['/gestion-bordereaux']);
  }

  // Valide un bordereau
  validerBordereau(bordereau: Bordereau): void {
    bordereau.statut = 'valide';
    this.toastr.success('Le bordereau a été validé avec succès', 'Succès');
    this.fermerDetails();
  }

  // Ouvre le modal de rejet
  ouvrirModalRejet(): void {
    this.motifRejet = '';
    this.showRejectModal = true;
  }

  // Ferme le modal de rejet
  fermerModalRejet(): void {
    this.showRejectModal = false;
    this.motifRejet = '';
  }

  // Confirme le rejet d'un bordereau
  confirmerRejet(): void {
    if (!this.motifRejet.trim()) {
      this.toastr.error('Veuillez indiquer un motif de rejet', 'Erreur');
      return;
    }

    if (this.bordereauSelectionne) {
      this.bordereauSelectionne.statut = 'rejete';
      this.bordereauSelectionne.motifRejet = this.motifRejet;
      this.toastr.warning('Le bordereau a été rejeté', 'Information');
      this.fermerModalRejet();
      this.fermerDetails();
    }
  }

  // Vérifie si un fichier est une image
  estImage(type: string): boolean {
    return type === 'image';
  }

  // Obtient la classe CSS pour le statut
  getClasseStatut(statut: string): string {
    switch (statut) {
      case 'valide': return 'badge bg-success';
      case 'rejete': return 'badge bg-danger';
      case 'en_attente':
      default:
        return 'badge bg-warning';
    }
  }

  // Obtient le libellé du statut
  getLibelleStatut(statut: string): string {
    switch (statut) {
      case 'valide': return 'Validé';
      case 'rejete': return 'Rejeté';
      case 'en_attente':
      default:
        return 'En attente';
    }
  }

  // Génère des données d'exemple (à remplacer par un appel API)
  private genererDonneesExemple(): Bordereau[] {
    const types = ['Importation', 'Exportation', 'Transit', 'Dédouanement', 'Transbordement'];
    const statuts: Array<'en_attente' | 'valide' | 'rejete'> = ['en_attente', 'en_attente', 'en_attente', 'valide', 'rejete']; // Plus d'éléments en attente
    const marques = [
      'Toyota', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Honda', 'Hyundai', 'Kia', 
      'Nissan', 'Peugeot', 'Renault', 'Volkswagen', 'Mazda', 'Mitsubishi', 'Suzuki'
    ];
    
    const modeles = [
      'Corolla', 'Focus', 'Série 3', 'Classe C', 'A4', 'Civic', 'Tucson', 'Sportage',
      'Qashqai', '208', 'Clio', 'Golf', 'CX-5', 'ASX', 'Swift', 'Camry', 'Mustang'
    ];
    
    const noms = [
      'Dupont', 'Martin', 'Dubois', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau',
      'Simon', 'Laurent', 'Michel', 'Garcia', 'Thomas', 'Robert', 'Richard'
    ];
    
    const villes = ['Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Bafoussam', 'Nkongsamba', 'Edea', 'Kribi'];
    const motifsRejet = [
      'Document illisible', 'Pièces manquantes', 'Signature manquante',
      'Date expirée', 'Informations incomplètes', 'Erreur de montant',
      'Cachet manquant', 'Numéro de série incorrect'
    ];

    const bordereaux: Bordereau[] = [];
    const now = new Date();

    // Générer entre 20 et 30 bordereaux
    const nbBordereaux = 20 + Math.floor(Math.random() * 11);
    
    for (let i = 1; i <= nbBordereaux; i++) {
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      const dateCreation = new Date(now);
      dateCreation.setDate(now.getDate() - Math.floor(Math.random() * 90)); // Derniers 90 jours
      
      const marque = marques[Math.floor(Math.random() * marques.length)];
      const modele = modeles[Math.floor(Math.random() * modeles.length)];
      const annee = 2019 + Math.floor(Math.random() * 6); // 2019 à 2024
      const typeFichier = Math.random() > 0.5 ? 'pdf' : 'image';
      const extension = typeFichier === 'pdf' ? 'pdf' : Math.random() > 0.5 ? 'jpg' : 'png';
      
      const bordereau: Bordereau = {
        id: `BORD-${2023}${String(i).padStart(4, '0')}`,
        numero: `BORD-${2023}${String(i).padStart(4, '0')}`,
        dateCreation: dateCreation,
        statut: statut,
        demande: {
          id: `DEM-${2023}${String(i).padStart(4, '0')}`,
          numero: `DEM-${2023}${String(i).padStart(4, '0')}`,
          type: types[Math.floor(Math.random() * types.length)],
          dateSoumission: new Date(dateCreation.getTime() - 86400000 * Math.floor(1 + Math.random() * 7)),
          demandeur: {
            nom: `${noms[Math.floor(Math.random() * noms.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
            email: `client${i}@${['gmail.com', 'yahoo.fr', 'outlook.com', 'hotmail.com'][Math.floor(Math.random() * 4)]}`,
            telephone: `+237 6${['5', '7', '9'][Math.floor(Math.random() * 3)]}${Math.floor(1000000 + Math.random() * 9000000)}`,
            adresse: `${Math.floor(1 + Math.random() * 300)} ${['rue', 'avenue', 'boulevard', 'route'][Math.floor(Math.random() * 4)]} ${noms[Math.floor(Math.random() * noms.length)]}, ${villes[Math.floor(Math.random() * villes.length)]}`
          },
          vehicule: {
            marque: marque,
            modele: modele,
            annee: annee,
            numeroSerie: `VIN${Math.floor(10000000000000000 + Math.random() * 90000000000000000).toString(16).toUpperCase()}`
          }
        },
        fichier: {
          nom: `bordereau-${1000 + i}.${extension}`,
          type: typeFichier,
          url: typeFichier === 'pdf' 
            ? '/assets/documents/bordereau-exemple.pdf' 
            : '/assets/images/bordereau-exemple.jpg',
          dateUpload: dateCreation,
          taille: typeFichier === 'pdf' 
            ? `${Math.floor(1 + Math.random() * 3)}.${Math.floor(10 + Math.random() * 80)} Mo`
            : `${Math.floor(2 + Math.random() * 5)}.${Math.floor(10 + Math.random() * 80)} Mo`
        }
      };

      if (statut === 'rejete' && Math.random() > 0.3) { // 70% de chance d'avoir un motif de rejet
        bordereau.motifRejet = motifsRejet[Math.floor(Math.random() * motifsRejet.length)];
      }

      bordereaux.push(bordereau);
    }

    // Trier par date de création décroissante
    return bordereaux.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
  }
}
