import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import icAdd from '@iconify/icons-ic/twotone-add';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icAssignment from '@iconify/icons-ic/twotone-assignment-ind';

moment.locale('es');

@Component({
  selector: 'app-hb-modal',
  templateUrl: './hb-modal.component.html'
})
export class HbModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;

  icAdd = icAdd;
  icDelete = icDelete;
  icAssignment = icAssignment;

  hb = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required])
  });

  items: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<HbModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    // this.currentPatient = this.apiService.currentPatient;
  }

  ngOnInit() {
    this.items = this.data.record.hbs;
  }

  ngAfterViewInit() {}

  add() {
    this.sending = true;
    const data = this.hb.value;

    const id = data.id ? `id: ${data.id},` : '';
    const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
    const description = `description: "${encodeURIComponent(data.description)}",`;
    const queryParams = `${id}, record_id: "${this.data.record.identification}", ${date} ${description}`;
    const queryProps = 'id, date, description';

    this.apiService.saveHb(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        const match = this.items.filter(value => value.id == response.data.saveHb.id);

        console.log(match);

        if (match.length > 0) {
          let newData = this.items.map((value: any) => {
            return value.id == response.data.saveHb.id ? response.data.saveHb : value;
          });

          this.items = newData;
        } else {
          this.items.unshift(response.data.saveHb);
          this.reset();
        }

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.sending = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  select(hb: any) {
    this.selected = hb;

    this.hb.setValue({
      id: hb.id,
      date: moment(hb.date).toISOString(),
      description: hb.description.replace(/<br>/g, '\n')
    });
  }

  reset() {
    this.selected = null;
    this.hb.reset();
    this.hb.markAsPristine();
    this.hb.markAsUntouched();
    this.hb.updateValueAndValidity();
  }

  delete() {
    var r = confirm('¿Eliminar?');
    if (r == true) {
      this.sending = true;
      const data = this.hb.value;

      const id = data.id ? `id: ${data.id},` : '';
      const queryParams = `${id}, delete: 1`;
      const queryProps = 'id';

      this.apiService.saveHb(queryParams, queryProps).subscribe(
        (response: any) => {
          this.sending = false;

          const index = this.items.findIndex(value => value.id == response.data.saveHb.id);

          console.log(index);

          this.items.splice(index, 1);
          this.reset();

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.sending = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    } else {
    }
  }

  close(params: any = null) {
    this.dialogRef.close(params);
  }

  ngOnDestroy(): void {}
}
