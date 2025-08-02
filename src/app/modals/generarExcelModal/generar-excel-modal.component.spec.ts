import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarExcelModalComponent } from './generar-excel-modal.component';

describe('GenerarExcelModalComponent', () => {
  let component: GenerarExcelModalComponent;
  let fixture: ComponentFixture<GenerarExcelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarExcelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarExcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
