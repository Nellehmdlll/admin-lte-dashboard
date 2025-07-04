import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ministere-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ministere-form.component.html',
  styleUrls: ['./ministere-form.component.scss']
})
export class MinistereFormComponent implements OnInit {
  ministereForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitted = false;
  ministereId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ministereForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20)]],
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      sigle: ['', [Validators.required, Validators.maxLength(10)]],
      description: [''],
      adresse: [''],
      telephone: ['', [Validators.pattern('^[0-9]{8,15}$')]],
      email: ['', [Validators.email]],
      statut: ['actif', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.ministereId = +id;
        this.loadMinistere(this.ministereId);
      }
    });
  }

  loadMinistere(id: number): void {
    this.loading = true;
    // Simuler un chargement depuis une API
    setTimeout(() => {
      // Données de démonstration - à remplacer par un appel API réel
      const mockData = {
        id: id,
        code: `MIN${id.toString().padStart(2, '0')}`,
        nom: `Ministère de l'Exemple ${id}`,
        sigle: `ME${id}`,
        description: `Description du ministère de l'exemple ${id}`,
        adresse: `${id} Avenue des Ministères, Ville`,
        telephone: `+225 01 23 45 67 8${id}`,
        email: `contact@ministere${id}.gouv.ci`,
        statut: 'actif'
      };
      
      this.ministereForm.patchValue(mockData);
      this.loading = false;
    }, 500);
  }

  get f() { return this.ministereForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.ministereForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Simuler un envoi de formulaire
    setTimeout(() => {
      console.log('Données du formulaire:', this.ministereForm.value);
      this.loading = false;
      
      // Rediriger vers la liste après soumission réussie
      this.router.navigate(['/settings/ministere']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/settings/ministere']);
  }
}
