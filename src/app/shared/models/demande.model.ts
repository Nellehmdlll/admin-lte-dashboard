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

export enum Moto {
  SIRIUS = 'Sirius',
  MT_07 = 'MT-07',
  MT_12 = 'MT-12',
  MT_15 = 'MT-15',
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

export interface Demande {
  // Informations de base
  id: number;
  numero: string;
  date: Date;
  type: TypeDemande;
  statut: StatutDemande;
  motif: MotifDemande;
  emetteur: string;
  destinataire: Destinataire;
  dateSoumission: Date;
  fichierJoint: FichierJoint;
  quantiteMoto: number;
  valeur: number;

  // Informations sur les motos
  marquemoto: MarqueMoto;
  typemoto: TypeMoto;
  moto: Moto;
  quantite:number;
  prix:number;


  // Informations sur l'importateur
  nomImportateur: string;
  adresseImportateur: string;
  telephoneImportateur: string;
  emailImportateur: string;

  // Informations sur l'acheteur
  nomAcheteur: string;
  adresseAcheteur: string;
  telephoneAcheteur: string;
  emailAcheteur: string;

  // Informations complémentaires
  detailsComplementaires?: string;
  documentsFournis: string[];

  // Validation et suivi
  dateValidation?: Date | null;
  motifRejet?: string | null;
  utilisateurId: number;
  dateCreation: Date;
  dateMiseAJour: Date;
}
