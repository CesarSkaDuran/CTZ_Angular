import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimoPagoModalComponent } from './ultimo-pago-modal.component';

describe('UltimoPagoModalComponent', () => {
  let component: UltimoPagoModalComponent;
  let fixture: ComponentFixture<UltimoPagoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltimoPagoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimoPagoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
