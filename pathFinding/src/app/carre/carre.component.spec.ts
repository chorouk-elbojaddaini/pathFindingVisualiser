import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreComponent } from './carre.component';

describe('CarreComponent', () => {
  let component: CarreComponent;
  let fixture: ComponentFixture<CarreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
