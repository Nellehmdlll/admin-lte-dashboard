import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-type-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './type-form.component.html',
  styleUrls: ['./type-form.component.scss']
})
export class TypeFormComponent implements OnInit {
  typeForm: FormGroup;
  isEditMode = false;
  loading = false;
  typeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.typeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      statut: ['actif', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const action = this.route.snapshot.url[1]?.path;
      
      if (id) {
        this.typeId = +id;
        this.isEditMode = action === 'edit';
        this.loadType(this.typeId);
      } else {
        this.isEditMode = false;
      }
    });
  }

  loadType(id: number): void {
    // Simulation de chargement d'un type existant
    // À remplacer par un appel API réel
    setTimeout(() => {
      const mockType = {
        id: 1,
        nom: 'Sportive',
        description: 'Motos conçues pour la performance et la vitesse',
        statut: 'actif',
        dateCreation: new Date('2024-01-15'),
        dateModification: new Date('2024-01-15')
      };
      
      this.typeForm.patchValue({
        nom: mockType.nom,
        description: mockType.description,
        statut: mockType.statut
      });
      
      this.loading = false;
    }, 500);
  }

  onSubmit(): void {
    if (this.typeForm.invalid) {
      this.markFormGroupTouched(this.typeForm);
      return;
    }

    this.loading = true;
    
    // Simulation d'enregistrement
    setTimeout(() => {
      console.log('Type sauvegardé:', this.typeForm.value);
      this.loading = false;
      this.router.navigate(['/settings/type']);
    }, 1000);
  }

  onCancel(): void {
    if (this.typeForm.dirty && !confirm('Voulez-vous vraiment quitter sans enregistrer les modifications ?')) {
      return;
    }
    this.router.navigate(['/settings/type']);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.typeForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
