import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenModalComponent } from './subir-imagen-modal.component';

describe('SubirImagenModalComponent', () => {
  let component: SubirImagenModalComponent;
  let fixture: ComponentFixture<SubirImagenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
