import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoDespachoComponent } from './estado-despacho.component';

describe('EstadoDespachoComponent', () => {
  let component: EstadoDespachoComponent;
  let fixture: ComponentFixture<EstadoDespachoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoDespachoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
