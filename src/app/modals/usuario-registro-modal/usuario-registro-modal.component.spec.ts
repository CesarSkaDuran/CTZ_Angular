import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioRegistroModalComponent } from './usuario-registro-modal.component';

describe('UsuarioRegistroModalComponent', () => {
  let component: UsuarioRegistroModalComponent;
  let fixture: ComponentFixture<UsuarioRegistroModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioRegistroModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioRegistroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
