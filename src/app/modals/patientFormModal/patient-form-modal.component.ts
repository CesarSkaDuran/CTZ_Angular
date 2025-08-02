import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeIn } from 'ng-animate';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';

moment.locale('es');

@Component({
  selector: 'app-patient-form-modal',
  templateUrl: './patient-form-modal.component.html',
  styleUrls: ['./patient-form-modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: '0.4', delay: 0 }
        })
      )
    ])
  ]
})
export class PatientFormModalComponent implements OnInit, AfterViewInit {
  fadeIn: any;
  sending = false;
  sended = false;

  patient = new FormGroup({
    id: new FormControl('', []),
    identification: new FormControl('', []),
    name: new FormControl(null, []),
    email: new FormControl('', []),
    birth_date: new FormControl('', []),
    phone: new FormControl('', []),
    create_user: new FormControl('', []),
    // civil_status: new FormControl('1', []),
    TipoDocumento: new FormControl('1', []),
    sex: new FormControl('1', []),
    // position: new FormControl('', []),
    // address: new FormControl('', []),
    // company: new FormControl('', []),
    // eps: new FormControl('0', []),
    // arl: new FormControl('0', []),
    // pension: new FormControl('0', []),
    // partner_name: new FormControl('', []),
    // partner_profession: new FormControl('', []),
  });

  arls = [];
  epss = [];
  pensions = [];

  constructor(
    public dialogRef: MatDialogRef<PatientFormModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getCreationData();

    if (this.data?.patient) {
      this.patient.setValue({
        id: this.data.patient.id ? this.data.patient.id : '',
        identification: this.data.patient.identification ? this.data.patient.identification : '',
        name: this.data.patient.name ? this.data.patient.name : '',
        email: this.data.patient.email ? this.data.patient.email : '',
        phone: this.data.patient.phone ? this.data.patient.phone : '',
        birth_date: this.data.patient.birth_date ? this.data.patient.birth_date : '',
        create_user: '',
        // civil_status: this.data.patient.civil_status ? this.data.patient.civil_status : '',
        // position: this.data.patient.position ? this.data.patient.position : '',
        // address: this.data.patient.address ? this.data.patient.address : '',
        // company: this.data.patient.company ? this.data.patient.company : '',
        // eps: this.data.patient.eps ? this.data.patient.eps.toString() : '',
        // arl: this.data.patient.arl ? this.data.patient.arl.toString() : '',
        // pension: this.data.patient.pension ? this.data.patient.pension.toString() : '',
        // partner_name: this.data.patient.partner_name ? this.data.patient.partner_name : '',
        // partner_profession: this.data.patient.partner_profession ? this.data.patient.partner_profession : '',
        // sexo: this.data.patient.sexo ? this.data.patient.sexo : '',
         TipoDocumento: this.data.patient.TipoDocumento ? this.data.patient.TipoDocumento.toString() : '',
      });
    }
  }

  getCreationData() {
    const queryParams = `status:1`;
    const queryProps = 'arls{id, name}, epss{id, name}, pensions{id, name}';

    this.apiService.getPatientCreationData(queryParams, queryProps).subscribe(
      (response: any) => {
        this.arls = response.data.patientCreationData.arls;
        this.epss = response.data.patientCreationData.epss;
        this.pensions = response.data.patientCreationData.pensions;
      },
      error => {

      }
    );
  }

  ngAfterViewInit() { }

  close(params: any = null) {
    this.dialogRef.close(params);
  }

  save() {
    this.sending = true;
    const data = this.patient.value;

    const id = data.id ? `id: ${data.id},` : '';
    const identification = data.identification != '' ? `identification: "${data.identification}",` : '';
    const name = data.name != '' ? `name: "${data.name}",` : '';
    const email = data.email != '' ? `email: "${data.email}",` : '';
    const birth_date = data.birth_date != '' ? `birth_date: "${moment(data.birth_date).format('YYYY-MM-DD')}",` : '';
    const phone = data.phone != '' ? `phone: "${data.phone}",` : '';
    const create_user = data.create_user != '' ? `create_user: "${data.create_user}",` : '';
    // const civil_status = data.civil_status != '' ? `civil_status: "${data.civil_status}",` : '';
     const TipoDocumento = data.TipoDocumento != '' ? `TipoDocumento: "${data.TipoDocumento}",` : '';
     const sex = data.sex != '' ? `sex: "${data.sex}",` : '';
    // const position = data.position != '' ? `position: "${data.position}",` : '';
    // const company = data.company != '' ? `company: "${data.company}",` : '';
    // const address = data.address != '' ? `address: "${data.address}",` : '';
    // const partner_name = data.partner_name != '' ? `partner_name: "${data.partner_name}",` : '';
    // const partner_profession = data.partner_profession != '' ? `partner_profession: "${data.partner_profession}",` : '';
    // const makeRecord = data.id ? `` : 'make_record: 1,';
    // const arl = data.arl != '' ? `arl: ${data.arl},` : '';
    // const eps = data.eps != '' ? `eps: ${data.eps},` : '';
    // const pension = data.pension != '' ? `pension: ${data.pension},` : '';

    console.log(create_user);

    const queryParams = `${id} ${identification} ${name} ${birth_date} ${phone}  ${create_user} ${TipoDocumento} ${email} ${sex}`;
    const queryProps =
      'id, name, identification, birth_date, phone, email, records{id, identification, motive}';

    this.apiService.savePatient(queryParams, queryProps).subscribe(
      (response: any) => {
        console.log(response);
        this.sending = false;
        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close( data );
      },
      error => {
        this.sending = false;
        this.snackBar.open('', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
}
