import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';

moment.locale('es');

@Component({
    selector: 'app-income-modal',
    templateUrl: './income-modal.component.html'
})
export class IncomeModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;

    obs = new FormGroup({
        id: new FormControl('', []),
        concept: new FormControl('', [Validators.required]),
        company: new FormControl('', []),
        date: new FormControl('', [Validators.required]),
        value: new FormControl(0, [Validators.required])
    });

    items: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<IncomeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        console.log(this.data.income);
        if (this.data.income) {
            this.obs.setValue({
                id: this.data.income.id,
                concept: this.data.income.concept,
                company: this.data.income.company ? this.data.income.company : '',
                date: this.data.income.date,
                value: this.data.income.value,
            });
        } else {
            this.obs.controls.date.setValue(new Date());
        }
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;

        const id = this.data.income ? `id: ${data.id},` : '';
        const concept = `concept: "${data.concept}",`;
        const company = data.company && data.company != '' ? `company: "${data.company}",` : '';
        const value = `value: "${data.value}",`;
        const date = data.date != '' ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : '';
        const queryParams = `${id} ${concept} ${value} ${date} ${company}`;
        const queryProps = 'id, concept, company, date, value, status';

        this.apiService.saveIncome(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(response.data.saveIncome);

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

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
