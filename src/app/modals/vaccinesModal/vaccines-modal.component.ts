import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import icAdd from '@iconify/icons-ic/twotone-add';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icAssignment from '@iconify/icons-ic/twotone-assignment-ind';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

moment.locale('es');

@Component({
  selector: 'app-vaccines-modal',
  templateUrl: './vaccines-modal.component.html'
})
export class VaccinesModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;

  icAdd = icAdd;
  icDelete = icDelete;
  icAssignment = icAssignment;

  vaccine = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required])
  });

  items: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<VaccinesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    // this.currentPatient = this.apiService.currentPatient;
  }

  ngOnInit() {
    this.items = this.data.record.vaccines;
  }

  ngAfterViewInit() {}

  add() {
    this.sending = true;
    const data = this.vaccine.value;

    const id = data.id ? `id: ${data.id},` : '';
    const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
    const description = `description: "${encodeURIComponent(data.description)}",`;
    const queryParams = `${id}, record_id: "${this.data.record.identification}", ${date} ${description}`;
    const queryProps = 'id, date, description';

    this.apiService.saveVaccine(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        const match = this.items.filter(value => value.id == response.data.saveVaccine.id);

        console.log(match);

        if (match.length > 0) {
          let newData = this.items.map((value: any) => {
            return value.id == response.data.saveVaccine.id ? response.data.saveVaccine : value;
          });

          this.items = newData;
        } else {
          this.items.unshift(response.data.saveVaccine);
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

  select(vaccine: any) {
    this.selected = vaccine;

    this.vaccine.setValue({
      id: vaccine.id,
      date: moment(vaccine.date).toISOString(),
      description: vaccine.description.replace(/<br>/g, '\n')
    });
  }

  reset() {
    this.selected = null;
    this.vaccine.reset();
    this.vaccine.markAsPristine();
    this.vaccine.markAsUntouched();
    this.vaccine.updateValueAndValidity();
  }

  delete() {
    var r = confirm('¿Eliminar?');
    if (r == true) {
      this.sending = true;
      const data = this.vaccine.value;

      const id = data.id ? `id: ${data.id},` : '';
      const queryParams = `${id}, delete: 1`;
      const queryProps = 'id';

      this.apiService.saveVaccine(queryParams, queryProps).subscribe(
        (response: any) => {
          this.sending = false;

          const index = this.items.findIndex(value => value.id == response.data.saveVaccine.id);

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
