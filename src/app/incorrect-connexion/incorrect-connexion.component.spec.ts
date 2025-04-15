import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorrectConnexionComponent } from './incorrect-connexion.component';

describe('IncorrectConnexionComponent', () => {
  let component: IncorrectConnexionComponent;
  let fixture: ComponentFixture<IncorrectConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncorrectConnexionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncorrectConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
