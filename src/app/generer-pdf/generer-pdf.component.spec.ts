import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenererPdfComponent } from './generer-pdf.component';

describe('GenererPdfComponent', () => {
  let component: GenererPdfComponent;
  let fixture: ComponentFixture<GenererPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenererPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenererPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
