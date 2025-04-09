import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageObjetComponent } from './page-objet.component';

describe('PageObjetComponent', () => {
  let component: PageObjetComponent;
  let fixture: ComponentFixture<PageObjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageObjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageObjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
