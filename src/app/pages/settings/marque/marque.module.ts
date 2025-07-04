import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MarqueListComponent } from './marque-list/marque-list.component';
import { MarqueFormComponent } from './marque-form/marque-form.component';
import { MarqueDetailComponent } from './marque-detail/marque-detail.component';
import { MarqueRoutingModule } from './marque-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MarqueRoutingModule,
    // Import des composants standalone
    MarqueListComponent,
    MarqueFormComponent,
    MarqueDetailComponent
  ]
})
export class MarqueModule { }
