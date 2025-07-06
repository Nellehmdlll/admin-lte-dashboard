import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeInfo } from './demande-info';

describe('DemandeInfo', () => {
  let component: DemandeInfo;
  let fixture: ComponentFixture<DemandeInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
