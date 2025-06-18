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

export interface Demande {
  // Informations de base
  id: number;
  numero: string;
  date: Date;
  type: TypeDemande;
  statut: StatutDemande;
  motif: MotifDemande;
  emetteur: string;
  destinataire: string;
  dateSoumission: Date;
  fichierJoint: FichierJoint;
  quantiteMoto: number;
  valeur: number;
  
  // Informations sur le véhicule
  numeroInscription: string;
  marque: string;
  modele: string;
  anneeFabrication: number;
  numeroChassis: string;
  paysOrigine: string;
  paysProvenance: string;
  
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
