import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOrderModalComponent } from './details-order-modal.component';

describe('DetailsOrderModalComponent', () => {
  let component: DetailsOrderModalComponent;
  let fixture: ComponentFixture<DetailsOrderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
