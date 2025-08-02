import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
  selector: 'app-obs-modal',
  templateUrl: './obs-modal.component.html'
})
export class ObsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;

  obs = new FormGroup({
    id: new FormControl('', []),
    description: new FormControl(null, [])
  });

  items: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ObsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    // this.currentPatient = this.apiService.currentPatient;
  }

  ngOnInit() {
    if (this.data.record) {
      console.log(this.data.record);
      this.obs.setValue({
        id: this.data.record.observations.id,
        description: this.data.record.observations.description
      });
    }
  }

  ngAfterViewInit() {}

  save() {
    this.sending = true;
    const data = this.obs.value;

    const id = data.id ? `id: ${data.id},` : '';
    const description = `description: "${encodeURIComponent(data.description)}",`;
    const queryParams = `${id}, record_id: "${this.data.record.identification}", ${description}`;
    const queryProps = 'id, description';

    this.apiService.saveObs(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(response.data.saveObs);
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

  close(params: any = null) {
    this.dialogRef.close(params);
  }

  ngOnDestroy(): void {}
}
