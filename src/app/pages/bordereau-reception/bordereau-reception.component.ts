import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-bordereau-reception',
  templateUrl: './bordereau-reception.component.html',
  styleUrls: ['./bordereau-reception.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class BordereauReceptionComponent implements OnInit {
  searchForm: FormGroup;
  autorisation: any = null;
  isSearching = false;
  fileToUpload: File | null = null;
  isUploading = false;
  uploadSuccess = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      numeroArrete: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isSearching = true;
      
      // Simuler un appel API
      setTimeout(() => {
        // Données factices pour la démo
        this.autorisation = {
          numero: this.searchForm.value.numeroArrete,
          date: new Date(),
          type: 'Importation',
          statut: 'En attente de réception',
          demandeur: 'Entreprise ABC',
          quantite: 5,
          modele: 'MT-07',
          marque: 'Yamaha'
        };
        this.isSearching = false;
      }, 1000);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
    }
  }

  onSubmitBordereau(): void {
    if (this.fileToUpload) {
      this.isUploading = true;
      
      // Simuler l'upload
      setTimeout(() => {
        this.isUploading = false;
        this.uploadSuccess = true;
        this.autorisation.bordereauUrl = 'url_du_bordereau.pdf';
        this.autorisation.statut = 'Bordereau téléchargé';
      }, 1500);
    }
  }

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
