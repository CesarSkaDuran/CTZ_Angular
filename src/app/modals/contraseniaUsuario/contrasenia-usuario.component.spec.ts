import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraseniaUsuarioComponent } from './contrasenia-usuario.component';

describe('ContraseniaUsuarioComponent', () => {
  let component: ContraseniaUsuarioComponent;
  let fixture: ComponentFixture<ContraseniaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContraseniaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraseniaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
