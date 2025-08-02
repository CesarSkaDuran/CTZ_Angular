import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarClienteModalComponent } from './registrar-cliente-modal.component';

describe('RegistrarClienteModalComponent', () => {
  let component: RegistrarClienteModalComponent;
  let fixture: ComponentFixture<RegistrarClienteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarClienteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarClienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
