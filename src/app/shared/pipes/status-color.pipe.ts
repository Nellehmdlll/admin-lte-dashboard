import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status?.toLowerCase()) {
      case 'validé':
      case 'validé':
        return 'bg-success';
      case 'en attente':
        return 'bg-warning';
      case 'rejeté':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
