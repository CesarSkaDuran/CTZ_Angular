import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquerDiaModalComponent } from './bloquer-dia-modal.component';

describe('BloquerDiaModalComponent', () => {
  let component: BloquerDiaModalComponent;
  let fixture: ComponentFixture<BloquerDiaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloquerDiaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloquerDiaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
