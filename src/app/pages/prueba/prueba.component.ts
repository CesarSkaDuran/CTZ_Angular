import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import icMoney from '@iconify/icons-feather/dollar-sign';
import icUser from '@iconify/icons-feather/user';
import icPeople from '@iconify/icons-feather/users';
import icVirtual from '@iconify/icons-feather/file-text';
import icClose from '@iconify/icons-ic/close';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Appointment } from 'src/app/models/appointment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { NewHistoryModalComponent } from 'src/app/modals/newHistoryModal/newHistoryModal.component';
import { pagosModalComponent } from 'src/app/modals/pagosModal/pagosModal.component';
import baselineOpenInNew from '@iconify/icons-ic/baseline-open-in-new';
import baselineCheck from '@iconify/icons-ic/baseline-check';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';

@Component({
    selector: 'app-home',
    templateUrl: './prueba.component.html',
    styleUrls: ['./prueba.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class PruebaComponent implements OnInit {
    dataPersona: any []=[];
    baselineOpenInNew = baselineOpenInNew;
    baselineCheck = baselineCheck;
    baselineDeleteForever = baselineDeleteForever;
    icMoney = icMoney;
    icUser = icUser;
    icPeople = icPeople;
    icVirtual = icVirtual;
    icClose = icClose;
    alertIsVisible = true;
    dataSource: MatTableDataSource<Appointment> | null;
    dataAppointment: MatTableDataSource<Appointment> | null;
    displayedColumns: string[] = ['patient', 'phone', 'date', 'time', 'service', 'doctor', 'status', 'options'];
    data: Appointment[] = [];
    loadingRecords = false;
    total: number;
    resultsLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;
    loadingPropect: boolean;
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', [])
    });
    
    constructor(
        public dialog: MatDialog,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
    ) {
        const codeSearchSubscription = this.keyUp
            .pipe(
                map((event: any) => event.target.value),
                debounceTime(300),
                distinctUntilChanged(),
                flatMap(search => of(search).pipe(delay(300)))
            )
            .subscribe(result => {
                this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
                //this.loadPropect();
            });
    }
   
    @ViewChild(MatSort) sort: MatSort;
    public keyUp = new Subject<any>();
    @ViewChild('search', { static: false }) searchEl: ElementRef;

    loadAppointment() {
        console.log('loading records...');

        this.loadingRecords = true;
       // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search:" "`;
        const queryProps =
            'id,  name, company, value, date, time, status, type, email_confirmation, phone_confirmation, reason, patient{id, name, identification, phone,}, doctor{id ,name,}';
        this.apiService.getAppointments(queryParams, queryProps).subscribe(
            (response: any) => {
               this.dataAppointment.data = response.data.appointments;
                this.total = this.data.reduce((
                    acc,
                    obj,
                ) => acc = obj.type++,
                    0);
            }, 
            error => {
                this.loadingRecords = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }
    datosPersonales() {
        this.dataPersona = [
            {
                id: 1,
                name: 'Carlos',
                phone_confirmation: '320 454 665',
                date: '2020-07-20',  
                time:'08:00 Am' ,
                reason:' prueba'


            },
            {
                id: 2,
                date: '2020-07-20',
                name: 'Juan',
                phone_confirmation: '123456789',
                time:'12:00 pm',
                reason:'prueba2'
               
            },     
        ];
    }
    

    loadAppointmentPaginator() {
        this.loadingPropect = true;
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
        const queryProps =
            'data{ id, name, company, value, date, time, status, type, email_confirmation, phone_confirmation, reason, patient{ id, name, identification, phone, }, doctor{ id, name, } }, total';

        this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
            (response: any) => {
                this.data = response.data.appointmentsPagination.data;
           
                this.resultsLength = response.data.appointmentsPagination.total;
                this.dataSource.data = this.data;
                this.loadingPropect = false;
                console.log(this.data)

            },
            error => {
                this.loadingPropect = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }

    ngOnInit() {
        this.loadAppointmentPaginator();
        this.loadAppointment();
        this.datosPersonales();
        this.dataPersona;
        console.log( 'esto es para mostrar datos', this.dataPersona)
        this.dataSource = new MatTableDataSource();
        this.dataAppointment = new MatTableDataSource();
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;

        this.loadAppointmentPaginator();
    }

    pageChange(event: PageEvent) {
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadAppointmentPaginator();
    }
    searchKeyUp($event: KeyboardEvent): void {
        console.log($event);
        if ($event.code === 'KeyN' && $event.shiftKey) {
            this.filters.controls.search.setValue('');
            return;
        }

        this.keyUp.next($event);
    }

    dateChange(event: any) {
        this.loadAppointmentPaginator();
    }

    editUser(user: any) {
        this.openPropectModal(user);
    }
    editPagos(user: any) {
        this.openPagosModal(user);
    }
    openPropectModal(user: any = null) {
        const dialogRef = this.dialog.open(NewHistoryModalComponent, {
            width: '700px',
            height: '500px',
            maxHeight: '850px',
            data: {
                user: user
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            //this.loadRecords();
            console.log(result);

        });
    }
    openPagosModal(user: any = null) {
        const dialogRef = this.dialog.open(pagosModalComponent, {
            width: '600px',
            height: '400px',
            maxHeight: '850px',
            data: {
                user: user
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            //this.loadRecords();
            console.log(result);

        });
    }
    delete(income: any) {

        const r = confirm('¿Eliminar Ingreso?');
        if (r === true) {
            this.loadingRecords = true;

            const id = income ? `id: ${income.id},` : '';
            const queryParams = `${id} delete: 1`;
            const queryProps = 'id ';

            this.apiService.deleteAppointment(queryParams, queryProps).subscribe(
                (response: any) => {
                    this.loadingRecords = false;

                    //      this.getPropect();

                    this._snackBar.open('Eliminado', null, {
                        duration: 4000
                    });
                },
                error => {
                    this.loadingRecords = false;
                    this._snackBar.open('Error.', null, {
                        duration: 4000
                    });

                    console.log(error);
                }
            );
        }
    }
}
