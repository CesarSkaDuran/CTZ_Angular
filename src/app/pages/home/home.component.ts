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
import icWarninr from '@iconify/icons-ic/warning';
import icExcel from '@iconify/icons-fa-brands/microsoft';
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
import { DetailsOrderModalComponent } from 'src/app/modals/detailsOrderModal/details-order-modal.component';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import icHistory from '@iconify/icons-feather/plus-square';
import { CoreService } from 'src/app/core/core.service';
import { AppointmentVendedorComponent } from 'src/app/modals/appointmentVendedor/appointmentVendedor.component';
import { AppointmentDetailComponent } from 'src/app/modals/appointmentDetail/appointmentDetail.component';
import { AppointmentPlantaComponent } from 'src/app/modals/appointmentPlanta/appointmentPlanta.component';
import { BloquerDiaModalComponent } from 'src/app/modals/bloquerDiaModal/bloquer-dia-modal.component';
import { GenerarExcelModalComponent } from 'src/app/modals/generarExcelModal/generar-excel-modal.component';
import { BloqueosModalComponent } from 'src/app/modals/bloqueosModal/bloqueos-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class HomeComponent implements OnInit {
    dataPersona: any []=[];
    dataBloqueo: any []=[];
    baselineOpenInNew = baselineOpenInNew;
    baselineCheck = baselineCheck;
    baselineDeleteForever = baselineDeleteForever;
    icMoney = icMoney;
    icUser = icUser;
    icHistory = icHistory;
    icPeople = icPeople;
    icVirtual = icVirtual;
    icClose = icClose;
    alertIsVisible = true;
    icWarninr=icWarninr;
    dataSourceUser: MatTableDataSource<Appointment> | null;
    dataSource: MatTableDataSource<Appointment> | null;
    dataAppointment: MatTableDataSource<Appointment> | null;
    datosAppointment: any[] = [];
    displayedColumns: string[] = ['patient', 'imagen',  'vendendor', 'time-c', 'time-o', 'date1', 'direccion', 'observaciones', 'descarga', 'tipo_concreto', 'id_tipo_concreto', 'date', 'precio_pedido', 'time', 'conductor',  'status', 'options'];
    data: Appointment[] = [];
    dataUser: Appointment[] = [];
    loadingRecords = false;
    total: number;
    resultsLength = 0;
    resultsLength1 = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100, 150, 200];
    orderBy = 'time';
    order = 'upward';
    limit = 10;
    offset = 0;
    cantidad_citas:any;
    datos: any[] = [];
    loadingPropect: boolean;
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', []),
    });
    totalPedidos: number;
    totalesM3:number;
    total_virtual: number;
    porcentaje: number;
    mes: string = '';
    totalm3: number;
    dataPagination: any[] = [];
    icExcel=icExcel;

    texto_cerrar_dia=false;
    texto_pedido=false;
    id_conductor: any;
    id_cliente: any;



    single = [];
    view: any[] = [700, 400];
  
    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
  
    colorScheme = {
      domain: ['#B71C1C', '#4CAF50']
    };
    usuario: any;
    role: any;






    constructor(
        public dialog: MatDialog,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private coreService: CoreService,
        private router: Router
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
                this.loadAppointmentPaginator();
                this.loadAppointmentPaginatorUser();
                this.loadAppointment_2();
                this.datosAppointment;
            });
        var usuarioJSON = localStorage.getItem('current_user');
        var usuario = JSON.parse(usuarioJSON);
        this.usuario = usuario
        this.role = this.usuario.role.role; 
    }
   
    @ViewChild(MatSort) sort: MatSort;
    public keyUp = new Subject<any>();
    @ViewChild('search', { static: false }) searchEl: ElementRef;

    generarExcelModal() {
        const dialogRef = this.dialog.open(GenerarExcelModalComponent, {
            width: '680px',
            height: 'auto'
        });

        dialogRef.afterClosed().subscribe((result: any) => {
        });
    }

    

    mesActual() {
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var d = new Date();
        this.mes = monthNames[d.getMonth()];
        console.log(this.mes);
    }

    bloquearDiaModal(){
        const dialogRef = this.dialog.open(BloquerDiaModalComponent, {
            width: '680px',
            height: '300px',
            data: {
                dataBloqueo:this.dataBloqueo
            }
          });
      
          dialogRef.afterClosed().subscribe((result: any) => {
            this.loadBloqueo();
            this.dataBloqueo;
            this.loadAppointmentPaginatorUser();
            this.loadAppointment_2();
            this.mesActual();
            this.dataPersona;
            this.dataSource;
            this.dataAppointment;
            this.dataSourceUser;
          });
    }

    userNombreRole() {
        return this.coreService.currentUser.role.permiso.crear_pedido;
    }


    userPermisoCrear() {
        return this.coreService.currentUser.role.permiso.crear_pedido;
    }
    userPermisoCerrarDia() {
        return this.coreService.currentUser.role.permiso.cerrar_dia;
    }
    userPermisoEditar() {
        return this.coreService.currentUser.role.permiso.editar_pedido;
    }
    userPermisoStatus() {
        return this.coreService.currentUser.role.permiso.status;
    }
    userRole() {
        return this.coreService.currentUser.role_id;
    }
    conductorName() {
        return this.coreService.currentUser.conductor.name;
    }
    userId() {
        return this.coreService.currentUser.id ? this.coreService.currentUser.id : null;
    }
    
    ocultarTablas() {
        if(this.userRole()==7){
            console.log("Este es el rol:");
            console.log(this.userRole());
            this.displayedColumns.splice(this.displayedColumns.findIndex( cols => cols == 'patient'), 1);;
            this.displayedColumns.splice(this.displayedColumns.findIndex( cols => cols == 'direccion'), 1);
            this.displayedColumns.splice(this.displayedColumns.findIndex( cols => cols == 'observaciones'), 1);
        }
        
    }

    bloqueoActual(){
        if(this.dataBloqueo.length>0){
            return "none";
        }else{
            return "initial";
        }
        
    }

    openBloqueosModal() {
        const dialogRef = this.dialog.open(BloqueosModalComponent, {
          width: '680px',
          height: '700px',
          maxHeight: '850px',
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
        });
    }
    
    openDetailsOrderModal(appointment: any = null) {
        const dialogRef = this.dialog.open(DetailsOrderModalComponent, {
          width: '680px',
          height: '700px',
          maxHeight: '850px',
          data: {
            appointment
          }
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
        });
    }
    loadAppointment_2() {
        console.log('loading records...');
        this.loadingRecords = true;


        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null && this.filters.value.date2 !== undefined
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : `date: "${moment().format('YYYY-MM-DD')}",`;
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null && this.filters.value.date2 !== undefined
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : `date2: "${moment().format('YYYY-MM-DD')}",`;
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `offset: ${this.offset}, limit: ${this.limit}, ${searchText} ${date} ${date2}`;
        const queryProps =
            ' id, name, company, observaciones, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, coordenadas, imagen, patient{ id, name, color  }, doctor{ id, name, }';
        this.apiService.getAppointmentMonth(queryParams, queryProps).subscribe(
            (response: any) => {
                this.datosAppointment = response.data.appointmentMonth;
                this.datos = this.datosAppointment = response.data.appointmentMonth;
                this.cantidad_citas=response.data.appointmentMonth.length;
                
                console.log("largo del query de citas:");
                console.log(response.data.appointmentMonth.length);
     
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


    loadBloqueo(){
        console.log('loading records...');
        this.loadingRecords = true;
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        //moment().format('YYYY-MM-DD');
        //const fecha_actual = `date:${moment().format('YYYY-MM-DD')}`;
        const queryParams = `date:"${moment().format('YYYY-MM-DD')}"`;
        const queryProps =
            'id, id_usuario, fecha, nombreusuario';
        this.apiService.getBloqueo(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataBloqueo = response.data.bloqueo;
                console.log("Acá está:");
                console.log(response.data.bloqueo);
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



    getEstadisticas(){
        this.apiService.getEstadisticas().subscribe((data)=>{
            console.log("ESTA ES LA DATA ESTADÍSTICAS DEVUELTAS POR LA API", data);
        });
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

        const aprobado = `aprobado: 2,`;
        const conductor = this.userRole()==7 && this.conductorName() ? `conductor:"${this.conductorName()}"`:``;

        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2} ${aprobado} ${conductor}`;

        console.log("QUERYPARAMS------------------------------------------------------------------------:");
        console.log(queryParams);

        const queryProps =
            'data{id, name, company, hora_descargue, fecha_pago, hora_llegada, hora_fin, observaciones, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, id_type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, coordenadas, imagen, producto{id, nombre, precio}, patient{ id, name, color  }, doctor{ id, name, } }, total';

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


                    this.single = [
                        {
                          "name": "Despachado",
                          "value": this.total_virtual
                        },
                        {
                          "name": "No despachado",
                          "value": this.totalPedidos
                        }
                      ];
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



    loadCliente() {
        console.log('loading clientes...');
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';

        
        const id=this.userId()?`id:${this.userId()}`:``;
        let queryParams = `${this.filters.value.search?searchText:'search:""'} ${id}`;
        let queryProperties =
            'id, user_id, photo, name, email, tipo_documento, direccion, contacto, telefono_empresa, telefono_contacto, color';
    
        this.apiService.getClientes(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                //this.dataClientes = response.data.cliente;
                this.id_cliente=response.data.cliente[0].id;
    
            },
    
            error => {
                console.log(error);
            }
        );
    }



    loadAppointmentPaginatorUser() {
        this.loadingRecords = true;
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null && this.filters.value.date2 !== undefined
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : `date: "${moment().format('YYYY-MM-DD')}",`;
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null && this.filters.value.date2 !== undefined
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : `date2: "${moment().format('YYYY-MM-DD')}",`;
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
        const queryProps =
            'data{ id, name, company, value, date, patient_id, updated_at, time, end_time, tipo_descarga, observaciones, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, coordenadas, imagen, patient{ id, name, color  }, doctor{ id, name, } }, total';

        this.apiService.getAppointmentAll(queryParams, queryProps).subscribe(
            (response: any) => {

                this.dataUser = response.data.appointmentAll.data;
                this.resultsLength1 = response.data.appointmentAll.total;
                this.dataSourceUser.data = this.dataUser;
                this.loadingRecords = false;
                this.dataPagination = this.dataUser;                    
                console.log(this.data);

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
            this.loadAppointmentPaginatorUser();
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.totalPedidos;
            this.totalm3;
            this.total;
            this.total_virtual;
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
            if (!result) return;
            this.loadAppointmentPaginatorUser();
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.totalPedidos;
            this.totalm3;
            this.total;
            this.total_virtual;
            console.log(result);
        });
    }
    openAppointmentModal(appointment: any = null) {
        const dialogRef = this.dialog.open(AppointmentModalComponent, {
            width: '680px',
            height: 'auto',
            //maxHeight: '850px',
            data: {
                appointment
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            //if (!result) return;
            this.loadAppointmentPaginatorUser();
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.totalPedidos;
            this.totalm3 ;
            this.total ;
            this.total_virtual ;
            //console.log(result);
        });
    }
    openAppointmentVendedor(appointment: any = null) {
        const dialogRef = this.dialog.open(AppointmentVendedorComponent, {
            width: '680px',
            height: 'auto',
            //maxHeight: '850px',
            data: {
                appointment
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            this.loadAppointmentPaginatorUser();
            this.loadAppointmentPaginator();
            this.loadAppointment_2();
            this.totalPedidos;
            this.totalm3;
            this.total;
            this.total_virtual;
            console.log(result);

        });
    }

    ngOnInit() {
        
        if(this.userRole()==8){
            this.router.navigate(['/app/panelcliente']);
        }

        if(this.userRole()==7){
            this.router.navigate(['/app/despachos']);
        }



        this.ocultarTablas();
        console.log("Cargando los appointments");
        this.loadAppointmentPaginator();
        this.loadAppointmentPaginator();
        console.log("Fin de los appointments");
        this.loadBloqueo();
        this.dataBloqueo;
        this.loadAppointmentPaginatorUser();
        this.loadAppointment_2();
        this.mesActual();
        this.dataPersona;
        console.log('esto es para mostrar datos', this.dataSourceUser)
        this.dataSource = new MatTableDataSource();
        this.dataAppointment = new MatTableDataSource();
        this.dataSourceUser = new MatTableDataSource();

        console.log("Permiso de cerrar dia");
        console.log(this.userPermisoCerrarDia());



        this.getEstadisticas();
        
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;
        this.loadAppointmentPaginatorUser();
        this.loadAppointment_2();
        this.datosAppointment;
        this.loadAppointmentPaginator();
    }

    pageChange(event: PageEvent) {
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadAppointment_2();
        this.datosAppointment;
        this.loadAppointmentPaginatorUser();
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
        this.loadAppointment_2();
        this.datosAppointment;
        this.loadAppointmentPaginatorUser();
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
                    this.loadAppointmentPaginatorUser();
                    this.loadAppointmentPaginator();
                    this.loadAppointment_2();
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



    onSelect(data): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
      }
    
      onActivate(data): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
      }
    
      onDeactivate(data): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
      }
}
