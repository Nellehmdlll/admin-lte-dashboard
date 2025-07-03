import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
import { Demande, TypeDemande as DemandeType } from '../models/demande.model';
import { ToastrService } from 'ngx-toastr';

// Définition locale de l'énumération TypeDemande pour éviter les erreurs de compilation
export enum TypeDemande {
  ACHAT = 'ACHAT',
  VENTE = 'VENTE',
  DON = 'DON',
  IMPORTATION = 'IMPORTATION',
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(
    private http: HttpClient,
    @Inject(ToastrService) private toastr: ToastrService
  ) {}

  /**
   * Génère un PDF à partir d'un template externe
   * @param demande Les données de la demande à inclure dans le PDF
   * @returns Une promesse résolue lorsque le PDF est généré
   */
  async generatePdf(demande: Demande): Promise<void> {
    try {
      console.log('Début de la génération du PDF...');

      // Charger le template HTML externe
      const templatePath = '/assets/pdf-template.html';
      const response = await this.http.get(templatePath, { responseType: 'text' }).toPromise();

      if (!response) {
        throw new Error('Impossible de charger le template PDF');
      }

      // Remplacer les placeholders par les données de la demande
      const template = this.populateTemplate(response, demande);

      // Créer un élément temporaire pour la conversion en PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.padding = '20mm';
      tempDiv.style.boxSizing = 'border-box';
      tempDiv.innerHTML = template;
      document.body.appendChild(tempDiv);

      try {
        // Convertir en PDF
        console.log('Conversion du template en image...');
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true
        });

        console.log('Création du PDF...');
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Télécharger le PDF
        const fileName = `autorisation_importation_${demande.numero || 'new'}.pdf`;
        pdf.save(fileName);
        console.log(`PDF enregistré sous le nom: ${fileName}`);

      } finally {
        // Nettoyer l'élément temporaire
        document.body.removeChild(tempDiv);
      }

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      this.toastr.error('Une erreur est survenue lors de la génération du PDF', 'Erreur');
      throw error;
    }
  }

  /**
   * Peuple le template avec les données de la demande
   * @param template Le template HTML
   * @param demande Les données de la demande
   * @returns Le template peuplé
   */
  private populateTemplate(template: string, demande: Demande): string {
    return template
      .replace(/\{\{numero\}\}/g, demande.numero || 'N/A')
      .replace(/\{\{dateSoumission\}\}/g, this.formatDate(demande.dateSoumission))
      .replace(/\{\{nomImportateur\}\}/g, demande.importateur?.nom || 'N/A')
      .replace(/\{\{adresseImportateur\}\}/g, demande.importateur?.adresse || 'N/A')
      .replace(/\{\{telephoneImportateur\}\}/g, demande.importateur?.telephone || 'N/A')
      .replace(/\{\{emailImportateur\}\}/g, demande.importateur?.email || 'N/A')
      .replace(/\{\{typeDemande\}\}/g, this.getTypeDemandeLabel(demande.type))
      .replace(/\{\{dateGeneration\}\}/g, this.formatDate(new Date()));
  }

  /**
   * Formate une date au format français
   * @param date La date à formater
   * @returns La date formatée
   */
  private formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retourne le libellé du type de demande
   * @param type Le type de demande
   * @returns Le libellé du type de demande
   */
  private getTypeDemandeLabel(type: DemandeType | undefined): string {
    if (!type) return 'N/A';

    const typeDemandes: {[key in DemandeType]: string} = {
      'Achat': 'Achat',
      'Vente': 'Vente',
      'Don': 'Don',
      'Importation': 'Importation',
    };

    return typeDemandes[type as DemandeType] || 'N/A';
  }
}
