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
  selector: 'app-citologies-modal',
  templateUrl: './citologies-modal.component.html'
})
export class CitologiesModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;
  icAdd = icAdd;
  icDelete = icDelete;
  icAssignment = icAssignment;

  citology = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', [Validators.required]),
    description: new FormControl(null, [Validators.required])
  });

  items: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CitologiesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    // this.currentPatient = this.apiService.currentPatient;
  }

  ngOnInit() {
    this.items = this.data.record.citologies;
  }

  ngAfterViewInit() {}

  add() {
    this.sending = true;
    const data = this.citology.value;

    const id = data.id ? `id: ${data.id},` : '';
    const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
    const description = `description: "${encodeURIComponent(data.description)}",`;
    const queryParams = `${id}, record_id: "${this.data.record.identification}", ${date} ${description}`;
    const queryProps = 'id, date, description';

    this.apiService.saveCitology(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        const match = this.items.filter(value => value.id === response.data.saveCitology.id);

        console.log(match);

        if (match.length > 0) {
          const newData = this.items.map((value: any) => {
            return value.id === response.data.saveCitology.id ? response.data.saveCitology : value;
          });

          this.items = newData;
        } else {
          this.items.unshift(response.data.saveCitology);
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

  select(citology: any) {
    this.selected = citology;

    this.citology.setValue({
      id: citology.id,
      date: moment(citology.date).toISOString(),
      description: citology.description.replace(/<br>/g, '\n')
    });
  }

  reset() {
    this.selected = null;
    this.citology.reset();
    this.citology.markAsPristine();
    this.citology.markAsUntouched();
    this.citology.updateValueAndValidity();
  }

  delete() {
    const r = confirm('¿Eliminar?');
    if (r === true) {
      this.sending = true;
      const data = this.citology.value;

      const id = data.id ? `id: ${data.id},` : '';
      const queryParams = `${id}, delete: 1`;
      const queryProps = 'id';

      this.apiService.saveCitology(queryParams, queryProps).subscribe(
        (response: any) => {
          this.sending = false;

          const index = this.items.findIndex(value => value.id === response.data.saveCitology.id);

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
