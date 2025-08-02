import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarUsuarioModalComponent } from './registrar-usuario-modal.component';

describe('RegistrarUsuarioModalComponent', () => {
  let component: RegistrarUsuarioModalComponent;
  let fixture: ComponentFixture<RegistrarUsuarioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarUsuarioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarUsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
