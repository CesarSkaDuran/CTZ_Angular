import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoPagosModalComponent } from './estado-pagos-modal.component';

describe('EstadoPagosModalComponent', () => {
  let component: EstadoPagosModalComponent;
  let fixture: ComponentFixture<EstadoPagosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoPagosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoPagosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
