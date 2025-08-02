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
    selector: 'app-evolution-modal',
    templateUrl: './evolution-modal.component.html'
})
export class EvolutionModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;

    icAdd = icAdd;
    icDelete = icDelete;
    icAssignment = icAssignment;

    obs = new FormGroup({
        id: new FormControl('', []),
        date: new FormControl('', []),
        rejuv: new FormControl('', []),
        mona: new FormControl('', []),
        details: new FormControl(null, [])
    });

    evoId: number;

    items: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<EvolutionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        if (this.data.evolution) {
            console.log(this.data.evolution);
            this.obs.setValue({
                id: this.data.evolution.id,
                date: moment(this.data.evolution.date).format('YYYY-MM-DD'),
                rejuv: this.data.evolution.rejuv && this.data.evolution.rejuv == 1 ? true : false,
                mona: this.data.evolution.mona && this.data.evolution.mona == 1 ? true : false,
                details: this.data.evolution.details.replace(/<br>/g, '\n')
            });
            this.evoId = this.data.evolution.id;
        } else {
            this.obs.controls.date.setValue(new Date());
        }
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;
        console.log(data);

        const id = this.data.evolution ? `id: ${data.id},` : '';
        const details = `details: "${data.details}",`;
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const rejuv = data.rejuv && data.rejuv != '' ? `rejuv: "${data.rejuv == true}",` : 'rejuv:".",';
        const mona = data.mona && data.mona != '' ? `mona: "${data.mona}",` : 'mona: ".",';
        const queryParams = `${id} record_id: "${this.data.record.identification}", ${date} ${details} ${rejuv} ${mona}`;
        const queryProps = 'id, date, details';

        this.apiService.saveEvolution(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveEvolution);

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

    delete() {
        this.sending = true;
        const data = this.obs.value;

        if (!data.id) {
            console.log('no puede eliminar');
            return;
        }

        const id = `id: ${data.id},`;
        const queryParams = `${id}  record_id: "${this.data.record.identification}", delete: 1,`;
        const queryProps = 'id';

        this.apiService.saveEvolution(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveEvolution);

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
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
