import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPagoModalComponent } from './generar-pago-modal.component';

describe('GenerarPagoModalComponent', () => {
  let component: GenerarPagoModalComponent;
  let fixture: ComponentFixture<GenerarPagoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarPagoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarPagoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
