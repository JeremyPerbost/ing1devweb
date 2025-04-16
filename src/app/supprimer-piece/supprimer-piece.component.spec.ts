import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprimerPieceComponent } from './supprimer-piece.component';

describe('SupprimerPieceComponent', () => {
  let component: SupprimerPieceComponent;
  let fixture: ComponentFixture<SupprimerPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprimerPieceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupprimerPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
