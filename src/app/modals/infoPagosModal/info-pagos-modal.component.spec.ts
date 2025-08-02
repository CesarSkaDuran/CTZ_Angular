import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPagosModalComponent } from './info-pagos-modal.component';

describe('InfoPagosModalComponent', () => {
  let component: InfoPagosModalComponent;
  let fixture: ComponentFixture<InfoPagosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPagosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPagosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
