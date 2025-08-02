import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesVistaComponent } from './clientes-vista.component';

describe('ClientesVistaComponent', () => {
  let component: ClientesVistaComponent;
  let fixture: ComponentFixture<ClientesVistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientesVistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
