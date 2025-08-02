import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';

import * as moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormGroup, FormControl, Validators } from '@angular/forms';
// moment.locale('es');

@Component({
  selector: 'app-control-modal',
  templateUrl: './control-modal.component.html'
})
export class ControlModalComponent implements OnInit, AfterViewInit {
  fadeIn: any;
  sending = false;
  sended = false;

  control = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', [Validators.required]),
    week: new FormControl('', [Validators.required]),
    weight: new FormControl('', []),
    control_t: new FormControl('', []),
    control_a: new FormControl('', []),
    control_pam: new FormControl('', []),
    control_au: new FormControl('', []),
    pression: new FormControl('', []),
    fcf: new FormControl('', []),
    edema: new FormControl('', []),
    created_at: new FormControl('', [])
  });

  constructor(
    public dialogRef: MatDialogRef<ControlModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.data.control) {
      console.log(this.data.control);
      this.control.setValue(this.data.control);
    }
  }

  ngAfterViewInit() {}

  close(data: any = null) {
    this.dialogRef.close(data);
  }

  create() {
    this.sending = true;
    const data = this.control.value;

    const id = data.id ? `id: ${data.id},` : '';
    const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;

    const week = data.week != '' && data.week != null ? `week: "${data.week}",` : 'week: ".",';
    const weight = data.weight != '' && data.weight != null ? `weight: "${data.weight}",` : 'weight: ".",';
    const control_t =
      data.control_t != '' && data.control_t != null ? `control_t: "${data.control_t}",` : 'control_t: ".",';
    const control_a =
      data.control_a != '' && data.control_a != null ? `control_a: "${data.control_a}",` : 'control_a: ".",';
    const control_pam =
      data.control_pam != '' && data.control_pam != null ? `control_pam: "${data.control_pam}",` : 'control_pam: ".",';
    const control_au =
      data.control_au != '' && data.control_au != null ? `control_au: "${data.control_au}",` : 'control_au: ".",';
    const pression = data.pression != '' && data.pression != null ? `pression: "${data.pression}",` : 'pression: ".",';
    const fcf = data.fcf != '' && data.fcf != null ? `fcf: "${data.fcf}",` : 'fcf: ".",';
    const edema = data.edema != '' && data.edema != null ? `edema: "${data.edema}",` : 'edema: ".",';

    const queryParams = `${id}, record_id: "${
      this.data.record.identification
    }", ${date} ${week} ${weight} ${control_t} ${control_a} ${control_pam} ${control_au} ${pression} ${fcf} ${edema}`;
    const queryProps = 'id';

    this.apiService.saveControl(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this.close(response.data.saveControl);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      (error: any) => {
        this.sending = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  displayFn(user?: any): string | undefined {
    return user ? user.name : undefined;
  }
}
