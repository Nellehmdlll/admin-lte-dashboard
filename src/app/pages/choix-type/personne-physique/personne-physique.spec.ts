import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnePhysique } from './personne-physique';

describe('PersonnePhysique', () => {
  let component: PersonnePhysique;
  let fixture: ComponentFixture<PersonnePhysique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnePhysique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnePhysique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
