import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMorale } from './personne-morale';

describe('PersonneMorale', () => {
  let component: PersonneMorale;
  let fixture: ComponentFixture<PersonneMorale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMorale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonneMorale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
