import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'vex-details-order-modal',
  templateUrl: './details-order-modal.component.html',
  styleUrls: ['./details-order-modal.component.scss']
})
export class DetailsOrderModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  obs = new FormGroup({
    id: new FormControl('', []),
    cliente: new FormControl('', []),
    metros: new FormControl('', [Validators.required]),
    direccion: new FormControl(0, [Validators.required]),
    time: new FormControl('', [Validators.required]),
    type: new FormControl('1', [Validators.required]),
    observaciones: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    hora_cargue: new FormControl('', [Validators.required]),
    hora_obra: new FormControl('', [Validators.required]),
    vendedor: new FormControl('', [Validators.required]),
    conductor: new FormControl('', [Validators.required]),
    status: new FormControl('1', []),
  });
}
