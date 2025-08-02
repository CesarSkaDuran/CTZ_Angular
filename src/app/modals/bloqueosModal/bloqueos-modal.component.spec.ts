import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueosModalComponent } from './bloqueos-modal.component';

describe('BloqueosModalComponent', () => {
  let component: BloqueosModalComponent;
  let fixture: ComponentFixture<BloqueosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloqueosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloqueosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
