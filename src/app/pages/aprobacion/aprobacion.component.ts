import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { Appointment } from 'src/app/models/appointment';
import check from '@iconify/icons-fa-solid/check-square';
import square from '@iconify/icons-feather/square';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentPlantaComponent } from 'src/app/modals/appointmentPlanta/appointmentPlanta.component';
import baselineOpenInNew from '@iconify/icons-ic/baseline-open-in-new';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import { AppointmentDetailComponent } from 'src/app/modals/appointmentDetail/appointmentDetail.component';
import { of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';

@Component({
  selector: 'vex-aprobacion',
  templateUrl: './aprobacion.component.html',
  styleUrls: ['./aprobacion.component.scss'],
  animations: [
    stagger80ms
]
})
export class AprobacionComponent implements OnInit {
  loadingPropect: boolean;
  loadingRecords = false;
  limit = 10;
  offset = 0;
  orderBy = 'time';
  order = 'upward';
  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
  });
  data: Appointment[] = [];
  resultsLength = 0;
  dataSource: MatTableDataSource<Appointment> | null;
  dataPagination: any[] = [];
  totalPedidos: number;
  totalesM3:number;
  totalm3: number;
  total_virtual: number;
  total: number;
  displayedColumns: string[] = ['id','cliente','fecha_despacho', 'hora_cargue', 'observaciones', 'direccion', 'fecha_pago','descarga', 'concreto', 'vendedor', 'acciones'];
  check=check;
  square=square;
  baselineOpenInNew = baselineOpenInNew;
  public keyUp = new Subject<any>();
  baselineDeleteForever=baselineDeleteForever;



  constructor(private apiService: ApiService, private _snackBar: MatSnackBar, public dialog: MatDialog,) {


    const codeSearchSubscription = this.keyUp
    .pipe(
        map((event: any) => event.target.value),
        debounceTime(300),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(300)))
    )
    .subscribe(result => {
        //this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
        this.loadAppointmentPaginator();
        this.dataSource;
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
                this.loadAppointmentPaginator();
                this.dataSource;
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
        this.dataSource;
    }
  

  loadAppointmentPaginator() {
    this.loadingRecords = true;
    const date =
    this.filters.value.date !== '' && this.filters.value.date !== null && this.filters.value.date2 !== undefined
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : `date: "${moment().format('YYYY-MM-DD')}",`;
const date2 =
    this.filters.value.date2 !== '' && this.filters.value.date2 !== null && this.filters.value.date2 !== undefined
        ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
        : `date2: "${moment().format('YYYY-MM-DD')}",`;

const aprobado = `aprobado: 1,`;

const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `${aprobado}limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
    const queryProps =
        'data{id, name, aprobado, fecha_pago, company, hora_descargue, hora_llegada, hora_fin, observaciones, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, patient{ id, name, color  }, doctor{ id, name, } }, total';

    this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
        (response: any) => {
            this.data = response.data.appointmentsPagination.data;
            this.resultsLength = response.data.appointmentsPagination.total;
            this.dataSource.data = this.data;
            this.loadingRecords = false;
            this.dataPagination = this.data;
            console.log(this.data);

            
            this.totalPedidos = this.dataPagination.reduce((
                acc,
                obj,
            ) => acc + (obj.type = obj.type++), 0
            );
            this.totalm3 = this.dataPagination.reduce((
                acc,
                obj,
            ) => acc + ( obj.metros = obj.metros++), 0
            );
            this.total = this.dataPagination.reduce((
                _acc1,
                obj,
            ) => _acc1 + (obj.status == '1' || obj.status == '2' ? 1 : 0),
                0);
                

                this.total_virtual = this.dataPagination.reduce((
                    _acc,
                    obj,
                ) => _acc + (obj.status == '3' ? 1 : 0),
                0);
        },
        error => {
            console.log("EL ERROR ESTUVO ACÁ 2");
            this.loadingRecords = false;
            this._snackBar.open('Error.', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
  }


  openAppointmentPlanta(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentPlantaComponent, {
        width: '680px',
        height: 'auto',
        //maxHeight: '850px',
        data: {
            appointment
        }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
        if (!result) return;
    });
}



openAppointmentDetail(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentDetailComponent, {
        width: '680px',
        height: 'auto',
        //maxHeight: '850px',
        data: {
            appointment
        }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
        this.loadAppointmentPaginator();
    });
}


  
  save(id_app, aprob) {

    var aux:number;

    if(aprob==1){
        aux=2;
    }else if(aprob==2){
        aux=1;
    }

    const id = id_app ? `id: ${id_app},` : '';
    const aprobado = aprob ? `aprobado: ${aux},` : '';
    const fecha_aprobado = `fecha_aprobado: "${moment().format('YYYY-MM-DD')}",`;

    const queryParams = ` ${id} ${aprobado} ${fecha_aprobado} `;
    const queryProps = 'id, metros';

    this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
        (response: any) => {

            this.loadAppointmentPaginator();
            this.dataSource = new MatTableDataSource();
            console.log("Permiso de cerrar dia");

            this._snackBar.open('Guardado', null, {
                duration: 4000
            });
        },
        error => {
            this._snackBar.open(error, null, {
                duration: 4000
            });
            console.log(error);
        }
    );
}

    getDias(fecha_pago){
        const hoy = moment().format("YYYY-MM-DD");
        const fecha = moment(fecha_pago);
        return fecha.diff(hoy, 'days');
    }


  ngOnInit(): void {
    this.loadAppointmentPaginator();
    this.dataSource = new MatTableDataSource();
    console.log("Permiso de cerrar dia");
  }

}
