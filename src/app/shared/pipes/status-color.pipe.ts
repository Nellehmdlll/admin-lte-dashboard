import { Pipe, PipeTransform } from '@angular/core';
import { StatutDemande } from '../models/demande.model';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(value: StatutDemande | string | undefined | null): string {
    if (!value) return 'secondary'; // Valeur par défaut si undefined ou null

    const status = typeof value === 'string' ? value.toLowerCase() : value;

    switch (status) {
      case StatutDemande.VALIDE:
      case 'validé':
        return 'success';
      case StatutDemande.EN_ATTENTE:
      case 'en attente':
        return 'warning';
      case StatutDemande.REJETE:
      case 'rejeté':
        return 'danger';
      case StatutDemande.TRAITE:
      case 'traité':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
