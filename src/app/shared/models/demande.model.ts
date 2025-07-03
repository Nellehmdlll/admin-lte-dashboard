export enum TypeDemande {
  ACHAT = 'Achat',
  DON = 'Don',
  IMPORTATION = 'Importation',
  VENTE = 'Vente'
}

export enum StatutDemande {
  EN_ATTENTE = 'en attente',
  VALIDE = 'validé',
  REJETE = 'rejeté',
  TRAITE = 'traité'
}

export enum MotifDemande {
  COMMERCE = 'Commerce',
  USAGE_PERSONNEL = 'Usage personnel',
  CADEAU = 'Cadeau',
  AUTRE = 'Autre'
}

export enum FichierJoint {
  FACTURE = 'Facture',
  BON_DE_LIVRAISON = 'Bon de livraison',
  BON_DE_COMMANDE = 'Bon de commande',
  AUTRE = 'Autre document'
}
export enum Destinataire {
  MDAC = 'Ministère de la Défense et Anciens Combattants',
  MICA = 'Ministère de l\'Industrie , du Commerce et de l\'Artisanat',
  BCMRF = 'BCMRF',
}


export enum MarqueMoto {
  YAMAHA = 'Yamaha',
  HONDA = 'Honda',
  SUZUKI = 'Suzuki',
  KAWASAKI = 'Kawasaki',
  BMW = 'BMW',
  DUCATI = 'Ducati',
}

export enum TypeMoto {
  Moto = 'Moto',
  MotoElectrique = 'MotoElectrique',
  ALOBA = 'ALOBA',
}

// Interfaces pour les parties prenantes
export interface PartiePrenante {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  type?: string;
}

export interface Importateur extends PartiePrenante {}
export interface Acheteur extends PartiePrenante {}
export interface Vendeur extends PartiePrenante {}

export interface Demande {
  // Informations de base
  id: number;
  numero: string;
  date: Date;
  type: TypeDemande;
  statut: StatutDemande;
  motif: MotifDemande;
  emetteur: string;
  dateSoumission: Date;
  dateTraitement?: Date;
  // Propriétés d'importateur (maintenues pour la rétrocompatibilité)
  nomImportateur: string;
  adresseImportateur: string;
  telephoneImportateur: string;
  emailImportateur: string;
  // Nouvelle structure d'importateur
  importateur?: Importateur;
  // Propriétés d'acheteur (maintenues pour la rétrocompatibilité)
  nomAcheteur?: string;
  adresseAcheteur?: string;
  telephoneAcheteur?: string;
  emailAcheteur?: string;
  // Nouvelle structure d'acheteur
  acheteur?: Acheteur;
  // Propriétés de vendeur (maintenues pour la rétrocompatibilité)
  nomVendeur?: string;
  adresseVendeur?: string;
  telephoneVendeur?: string;
  emailVendeur?: string;
  // Nouvelle structure de vendeur
  vendeur?: Vendeur;
  // Propriétés de bénéficiaire
  nomBeneficiaire?: string;
  adresseBeneficiaire?: string;
  telephoneBeneficiaire?: string;
  emailBeneficiaire?: string;

  // Informations complémentaires
  detailsComplementaires?: string;
  documentsFournis: string[];

  // Propriétés pour les motos
  marquemoto?: string;
  typemoto?: string;
  quantite?: number;
  prix?: number;
  valeur?: number;
  quantiteMoto?: number;

  // Propriétés pour les types de parties prenantes
  typeVendeur?: string;
  typeAcheteur?: string;
  typeBeneficiaire?: string;

  // Fichiers joints
  fichierJoint: FichierJoint;

  // Destinataire
  destinataire?: Destinataire;

  // Validation et suivi
  dateValidation?: Date | null;
  dateRejet?: Date | null;
  motifRejet?: string | null;
  validePar?: string;
  rejetePar?: string;
  utilisateurId: number;
  dateCreation: Date;
  dateMiseAJour: Date;
}
