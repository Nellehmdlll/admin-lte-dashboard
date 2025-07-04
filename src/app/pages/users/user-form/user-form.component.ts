import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

export interface UserFormData {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  statut: 'actif' | 'inactif' | 'suspendu';
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: UserFormData | null = null;
  @Output() submitForm = new EventEmitter<UserFormData>();
  
  userForm: FormGroup;
  isEditMode = false;
  loading = false;
  
  // Options pour les sélecteurs
  roles = [
    { value: 'Administrateur', label: 'Administrateur' },
    { value: 'Gestionnaire', label: 'Gestionnaire' },
    { value: 'Utilisateur', label: 'Utilisateur' }
  ];
  
  statuts = [
    { value: 'actif', label: 'Actif' },
    { value: 'inactif', label: 'Inactif' },
    { value: 'suspendu', label: 'Suspendu' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      role: ['', Validators.required],
      statut: ['actif', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.isEditMode = true;
      this.userForm.patchValue(this.user);
    } else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          // Ici, vous devriez charger l'utilisateur depuis un service
          // this.loadUser(id);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const formValue = this.userForm.value;
      
      if (this.isEditMode && this.user?.id) {
        formValue.id = this.user.id;
      }
      
      this.submitForm.emit(formValue);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  // Méthode utilitaire pour accéder facilement aux contrôles du formulaire
  get f() { return this.userForm.controls; }
}
