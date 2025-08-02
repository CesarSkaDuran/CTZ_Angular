import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject, of } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil, switchMap } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
//import { CuentaDoctorModalComponent } from '../cuentaDoctorModal/cuentaDoctorModal.component';
//import { CorresponsalModalComponent } from '../corresponsalModal/corresponsalModal.component';

moment.locale('es');


@Component({
    selector: 'app-pagosModal',
    templateUrl: './pagosModal.component.html'
})
export class pagosModalComponent implements OnInit, AfterViewInit, OnDestroy {
    isNew = true;
    userData: any = [];
    protected patients: any[] = [];
    displayedColumns: string[] = ['id', 'name', 'lastname', 'email', 'phone', 'course', 'country', 'date', 'age',];
    displayedColumn: string[] = ['name', 'date',];
    sending = false;
    selected: any = null;
    showOnlyName = false;
    //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    model: any[] = [];
    msg: String = "";
    pagosForm = new FormGroup({
        id: new FormControl('', []),
        payment_type: new FormControl('', [Validators.required]),
    });
    tableData: any[] = [];

    loading = false;
    dataNewPropect: any[] = [];
    items: any[] = [];

    userForm = new FormGroup({
        id: new FormControl('', []),
        novedad: new FormControl('', [Validators.required]),
    });

    public patientFilterCtrl: FormControl = new FormControl();

    public filteredPatients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    protected _onDestroy = new Subject<void>();

    constructor(

        public dialogRef: MatDialogRef<pagosModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,

    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    loadRecords() {
        this.tableData.push(this.data.user);
    }

    ngOnInit() {
        this.loadRecords();

        //  this.getNewPropect();
    }
    detailsHistory(data: any) {

        console.log(data);
        this.apiService.setRecord(data);
        this.router.navigate(['/app/detalle-historia/']);
    }
    save() {

        this.sending = true;
        const data = this.pagosForm.value;

        console.log(data);

        const id = `propect_id: ${this.data.user.id},`;
        const novedad = `novedad: "${data.novedad}"`;
        //const propect_id = `propect_id: ${data.id},`;

        if (data.payment_type == 5) {
            
        }
        if(data.payment_type == 4) {
             
               this.close(data);
        }
        if (data.payment_type == 1) {
        
            this.close(data);
        }
    }

    ngAfterViewInit() { }


    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    addEmployee(): void {
        this.dataNewPropect.push(this.model);
        this.msg = 'campo agregado';
    } 
    
   
}

