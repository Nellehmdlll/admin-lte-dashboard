import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixType } from './choix-type';

describe('ChoixType', () => {
  let component: ChoixType;
  let fixture: ComponentFixture<ChoixType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
