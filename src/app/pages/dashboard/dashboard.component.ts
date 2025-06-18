import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StatusColorPipe } from '../../shared/pipes/status-color.pipe';

export interface Demande {
  id: number;
  numero: string;
  date: Date;
  statut: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('demandeModal') private modalContent!: TemplateRef<any>;
  
  demandes: Demande[] = [
    { id: 1, numero: 'DEM-001', date: new Date('2023-01-01'), statut: 'en attente' },
    { id: 2, numero: 'DEM-002', date: new Date('2023-01-02'), statut: 'validé' },
    { id: 3, numero: 'DEM-003', date: new Date('2023-01-03'), statut: 'rejeté' }
  ];

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {}

  openDemandeModal() {
    const modalRef = this.modalService.open(this.modalContent, { 
      centered: true,
      windowClass: 'demande-modal',
      backdropClass: 'transparent-backdrop',
      backdrop: true,
      keyboard: false
    });
    
    // Empêcher le clic sur le backdrop de fermer la modale
    document.querySelector('.modal-backdrop')?.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    
    modalRef.result.then((result: string) => {
      if (result === 'physique') {
        this.router.navigate(['/demande/physique']);
      } else if (result === 'morale') {
        this.router.navigate(['/demande/morale']);
      }
    }, () => {
      // Modal dismissed
    });
  }

  selectDemandeType(type: string) {
    this.modalService.dismissAll(type);
  }

  downloadBordereau(id: number): void {
    console.log('Téléchargement du bordereau pour la demande ID:', id);
    // Add your download logic here
  }
}
