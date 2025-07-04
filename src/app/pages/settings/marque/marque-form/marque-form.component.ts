import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Marque {
  id: number;
  nom: string;
  description: string;
  statut: 'actif' | 'inactif';
  dateCreation: Date;
  dateModification?: Date;
}

@Component({
  selector: 'app-marque-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './marque-form.component.html',
  styleUrl: './marque-form.component.scss'
})
export class MarqueFormComponent implements OnInit {
  marqueForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitted = false;
  marqueId: number | null = null;

  // Données factices pour la démo
  private dummyMarques: Marque[] = [
    {
      id: 1,
      nom: 'Yamaha',
      description: 'Fabricant japonais de motos',
      statut: 'actif',
      dateCreation: new Date('2024-01-15'),
      dateModification: new Date('2024-01-15')
    },
    {
      id: 2,
      nom: 'Honda',
      description: 'Fabricant japonais de motos et automobiles',
      statut: 'actif',
      dateCreation: new Date('2024-01-10'),
      dateModification: new Date('2024-01-12')
    },
    {
      id: 3,
      nom: 'Kawasaki',
      description: 'Fabricant japonais de motos et motos',
      statut: 'inactif',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10')
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.marqueForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      statut: ['actif', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Vérifier si on est en mode édition
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.marqueId = +id;
        this.loadMarque(this.marqueId);
      }
    });
  }

  // Pour accéder facilement aux contrôles du formulaire
  get f() {
    return this.marqueForm.controls;
  }

  // Charger une marque existante
  private loadMarque(id: number): void {
    this.loading = true;
    // Simulation de chargement
    setTimeout(() => {
      const marque = this.dummyMarques.find(m => m.id === id);
      if (marque) {
        this.marqueForm.patchValue({
          nom: marque.nom,
          description: marque.description,
          statut: marque.statut
        });
      } else {
        // Rediriger si la marque n'existe pas
        this.router.navigate(['/settings/marque-moto']);
      }
      this.loading = false;
    }, 500);
  }

  // Soumettre le formulaire
  onSubmit(): void {
    this.submitted = true;

    // Arrêter si le formulaire est invalide
    if (this.marqueForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulation d'envoi au serveur
    setTimeout(() => {
      const marqueData = this.marqueForm.value;

      if (this.isEditMode && this.marqueId) {
        // Mise à jour d'une marque existante
        console.log('Mise à jour de la marque:', { id: this.marqueId, ...marqueData });
        // Ici, vous devriez appeler votre service pour mettre à jour la marque
      } else {
        // Création d'une nouvelle marque
        const newId = Math.max(...this.dummyMarques.map(m => m.id)) + 1;
        console.log('Création de la marque:', { id: newId, ...marqueData });
        // Ici, vous devriez appeler votre service pour créer la marque
      }

      // Rediriger vers la liste des marques après la sauvegarde
      this.router.navigate(['/settings/marque-moto']);
    }, 1000);
  }

  // Annuler et revenir à la liste
  onCancel(): void {
    if (this.marqueForm.pristine || confirm('Voulez-vous vraiment annuler les modifications ?')) {
      this.router.navigate(['/settings/marque-moto']);
    }
  }

  // Vérifier si un champ a une erreur
  hasError(controlName: string, errorName: string): boolean {
    const control = this.marqueForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched || this.submitted) : false;
  }
}
