import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';

moment.locale('es');

@Component({
  selector: 'app-patients-modal',
  templateUrl: './patients-modal.component.html',
  styleUrls: ['./patients-modal.component.scss']
})
export class PatientsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  currentPatient: any;
  preselectedPatient: any;
  currentPatientIndex: number;
  // companySelectionListener = null;
  patients: any = [];
  loading = false;
  searchText = '';
  codeSearchSubscription: any;

  public searchKeyUp = new Subject<any>();
  @ViewChild('patientsListControl', { static: true }) patientsListControlEl: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PatientsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    // this.currentPatient = this.apiService.currentPatient;

    this.codeSearchSubscription = this.searchKeyUp
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(300),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(300)))
      )
      .subscribe(result => {
        console.log('loading patients from search');
        this.loadPatients();
      });
  }

  ngOnInit() {
    // console.log(this.textarea);
    // this.textarea.nativeElement.style.hight = `${this.textarea.nativeElement.offsetHeight + 10}px`;
    // this.companySelectionListener = this.apiService.companySelected$.subscribe(company => {
    //     this.currentPatient = company;
    // });
  }

  ngAfterViewInit() {
    this.loadPatients();
    // (document.querySelector('.textareaA') as HTMLElement).style.height = `${this.textarea.nativeElement.offsetHeight + 10}px`;
  }

  loadPatients() {
    this.loading = true;

    let searchText = this.searchText !== '' ? this.searchText : '.';

    console.log('loading patients...');

    let queryParams = `search: "${searchText}"`;
    let queryProperties =
      'id, name, identification, position, civil_status, birth_date, phone, company, partner_name, partner_profession';

    this.apiService.getPatients(queryParams, queryProperties).subscribe(
      (response: any) => {
        console.log(response);
        this.patients = response.data.patients;
        this.currentPatientIndex = 0;
        this.preselectedPatient = null;

        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  searchPatientKeyUp($event: KeyboardEvent): void {
    if ($event.code == 'KeyN' && $event.shiftKey) {
      this.searchText = '';
      return;
    }

    if ($event.code == 'ArrowUp' || $event.code == 'ArrowDown') {
      return;
    }

    if ($event.key !== 'Shift') {
      this.searchKeyUp.next($event);
    }
  }

  onDomChange($event: MutationRecord) {
    // if ($event.attributeName == 'class' && ) {

    // }
    console.log($event);
  }

  /*
        Patients list control
    */

  onSearchEnter() {
    if (this.preselectedPatient) {
      console.log('select this patient');

      this.loading = true;

      const id = this.preselectedPatient.id ? `id: ${this.preselectedPatient.id},` : '';
      const identification = this.preselectedPatient.identification
        ? `identification: "${this.preselectedPatient.identification}",`
        : '';

      const queryParams = `${id} ${identification}`;
      const queryProps =
        'id,identification, patient{id, name, identification, civil_status, position, birth_date, address, phone, company, partner_name, partner_profession}, details{id, motive}, conclusion{id, diagnosis}, created_at';

      this.apiService.makeRecord(queryParams, queryProps).subscribe(
        (response: any) => {
          console.log(response);

          this.loading = false;

          this.close(response.data.makeRecord);

          this.snackBar.open('Guardado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
      // go to patient
      // return;
    }

    this.selectNextPatient();
  }

  selectNextPatient(): void {
    console.log('there');
    if (!this.preselectedPatient) {
      this.preselectedPatient = this.patients[0];
      this.currentPatientIndex = 0;
      return;
    }

    this.currentPatientIndex =
      this.currentPatientIndex < this.patients.length - 1 ? this.currentPatientIndex + 1 : this.currentPatientIndex;

    this.preselectedPatient = this.patients[this.currentPatientIndex];
  }

  selectPreviousPatient(): void {
    if (!this.preselectedPatient) {
      return;
    }

    this.currentPatientIndex = this.currentPatientIndex > 0 ? this.currentPatientIndex - 1 : this.currentPatientIndex;

    this.preselectedPatient = this.patients[this.currentPatientIndex];
  }

  // date_format(date) {
  //     return moment(date).format("LLL");
  // }

  close(params: any = null) {
    this.dialogRef.close(params);
  }

  selectPatient(patient: Object) {
    console.log('patient selected');
    // this.apiService.companyIsSelected(company);
    this.onSearchEnter();
    // this.dialogRef.close();
  }

  openNewPatient(): void {
    const dialogRef = this.dialog.open(PatientFormModalComponent, {
      width: '500px',
      height: '562px',
      maxHeight: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('patients form closed');
      if (result) {
        let record = result.records[0];
        record.patient = {
          id : record.id,
          identification : record.identification,
          name : record.name,
          civil_status : record.civil_status,
          position : record.position,
          birth_date : record.birth_date,
          phone : record.phone,
          company : record.company,
          partner_name : record.partner_name,
          partner_profession : record.partner_profession,
          profile_url : record.profile_url,
        };

        this.close(record);
      }
      //    this.loadPatients();
    });
  }

  ngOnDestroy(): void {
    // this.companySelectionListener.unsubscribe();
    this.codeSearchSubscription.unsubscribe();
  }
}
