import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import icMoney from '@iconify/icons-feather/dollar-sign';
import accountCash from '@iconify/icons-feather/user';
import icPeople from '@iconify/icons-feather/users';
import icVirtual from '@iconify/icons-feather/file-text';
import icClose from '@iconify/icons-ic/close';
//import roundAddTask from '@iconify/icons-ic/round-add-task';
import baselineSettingsEthernet from '@iconify/icons-ic/baseline-settings-ethernet';
import twotoneEqualizer from '@iconify/icons-ic/twotone-equalizer';
import { PageEvent } from '@angular/material/paginator';
import baselineOpenInNew from '@iconify/icons-ic/baseline-open-in-new';
import baselineCheck from '@iconify/icons-ic/baseline-check';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';
import { Style } from 'src/@vex/services/style.service';
import { MatTableDataSource } from '@angular/material/table';
import { NewHistoryModalComponent } from 'src/app/modals/newHistoryModal/newHistoryModal.component';
import { CalendarOptions, EventApi, FullCalendarComponent } from '@fullcalendar/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
//import { PropectList } from 'src/app/models/propectsList';
import moment from 'moment';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import icCamera from '@iconify/icons-ic/videocam';
import sharpSlowMotionVideo from '@iconify/icons-ic/sharp-slow-motion-video';
import baselineHelp from '@iconify/icons-ic/baseline-help';
import { VideoModalComponent } from 'src/app/modals/videoModal/video-modal.component';
import { CambiarProductoModalComponent } from 'src/app/modals/cambiarProductor/cambiarProducto-modal.component';
import { Productos } from 'src/app/models/producto';
import { CrearProductoComponent } from 'src/app/modals/crearProducto/crearProducto-modal.component';
import { NuevoVendedorComponent } from 'src/app/modals/crearVendedor/nuevo-vendedor-modal.component';
import { CoreService } from 'src/app/core/core.service';
import edit from '@iconify/icons-fa-solid/pen-square';
// import { Alergias } from 'src/app/models/alergias';
// import { Enfermedades } from 'src/app/models/enfermedades';
// import { Medicinas } from 'src/app/models/medicinas';
// import { AlergiaModalComponent } from 'src/app/modals/alergiaModal/alergiaModal.component';
// import { PatologiaModalComponent } from 'src/app/modals/patologiaModal/patologiaModal.component';
// import { MedicinaModalComponent } from 'src/app/modals/medicinaModal/medicinaModal.component';

@Component({
    selector: 'app-vendedores',
    templateUrl: './vendedores.component.html',
    styleUrls: ['./vendedores.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class VendedoresComponent implements OnInit, AfterViewInit {
    icMoney = icMoney;
    accountCash = accountCash;
    icPeople = icPeople;
    icVirtual = icVirtual;
    icClose = icClose;
    baselineCheck = baselineCheck;
    baselineOpenInNew = baselineOpenInNew;
    //roundAddTask = roundAddTask;
    twotoneEqualizer = twotoneEqualizer;
    baselineSettingsEthernet = baselineSettingsEthernet;
    baselineDeleteForever = baselineDeleteForever;
    icCamera = icCamera;
    sharpSlowMotionVideo = sharpSlowMotionVideo;
    baselineHelp = baselineHelp;
    alertIsVisible = true;
    msg: string = '';
    displayedColumns: string[] = ['id', 'nombre', 'telefono', 'email', 'cedula', 'options'];//,  'date'
    edit=edit;
    sales: any[] = [];
    dataPropect: any[] = [];
    dataUser: any[] = [];
    members: any[] = [];
    loadingRecords = false;
    resultsLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;
    loading = false;
    total: number;
    totalPropect: number;
    porcentaje: number;
    mes: string = '';
    loadingPropect = false;
    dataSource: MatTableDataSource<Productos> | null;
    data: Productos[] = [];
    dataAlergia: any[] = [];
    patients: any []=[];

    
    filters = new FormGroup({
        search: new FormControl('', [])
    });

    
    editarVendedoresPermiso() {
        return this.coreService.currentUser.role.permiso.editar_vendedores;
    }

    verVendedoresPermiso() {
        return this.coreService.currentUser.role.permiso.ver_vendedores;
    }

    constructor(
        public dialog: MatDialog,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute,
        private coreService: CoreService,
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
                this.loadPatients();
                this.patients;
                //this.loadVendedores();
                this.mes;
            });
    }
    
    @ViewChild(MatSort) sort: MatSort;
    public keyUp = new Subject<any>();
    @ViewChild('search', { static: false }) searchEl: ElementRef;
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;


    ngOnInit() {
        this.loadPatients();
        this.dataSource = new MatTableDataSource();
        this.patients;
        //this.loadVendedores();
        this.mes;
    }

    userPermisoCrear() {
        return this.coreService.currentUser.permiso.crear_pedido;
    }

    userPermisoStatus() {
        return this.coreService?.currentUser?.role?.permiso?.status;
    }

    loadUser() {
        console.log('loading records...');
        this.loadingRecords = true;
        const queryParams = `todo:1`;
        const queryProps =
            'id, name';
        this.apiService.getUser(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataUser = response.data.user;
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

    loadPatients() {
        console.log('loading records...');
        this.loadingRecords = true;
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `${this.filters.value.search?searchText:'search:""'}`;
        const queryProps =
            'id, name, identity, email, phone';

        this.apiService.getPatients(queryParams, queryProps).subscribe(
            (response: any) => {
                this.patients = response.data.appPatient;
                //this.dataSource.data = this.data
                console.log("Llegué hasta aquí:");
                console.log(response);
            },
            error => {
                this.loadingRecords = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log("Llegué hasta el error:");
                console.log(error);
            }
        );
    }
    
sortRecords(event: MatSort): void {
    //this.orderBy = event.active;
    //this.order = event.direction;
    this.loadPatients();
    this.patients;
  }
  
  pageChange(event: PageEvent) {
    //this.limit = event.pageSize;
    //this.offset = event.pageSize * event.pageIndex;
    //this.loadClientes();
    //this.dataClientes;
  }
  searchKeyUp($event: KeyboardEvent): void {
    console.log("Evento captado");
    console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
        this.filters.controls.search.setValue('');
        return;
    }
    this.keyUp.next($event);
  }
  
  dateChange(event: any) {
    this.loadPatients();
    this.patients;
  }


    ngAfterViewInit() {

    }



    delete(vendedor: any) {

        const r = confirm('¿ Desea eliminar el vendedor?');
        if (r === true) {
            this.loadingRecords = true;

            const id = vendedor ? `id: ${vendedor.id},` : '';
            const queryParams = `${id} delete: 1`;
            const queryProps = 'id';

            this.apiService.savePatient(queryParams, queryProps).subscribe(
                (response: any) => {
                    this.loadingRecords = false;

                    this.loadPatients();
                    this.dataSource = new MatTableDataSource();
                    this.patients;

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

    registrarUsuarioModal(id_vendedor = null) {
        const dialogRef = this.dialog.open(NuevoVendedorComponent, {
          width: '450px',
          height: 'auto',
          data:{
            id_vendedor:id_vendedor
          }
        });
      
        dialogRef.afterClosed().subscribe((result: any) => {
            this.loadPatients();
            this.dataSource = new MatTableDataSource();
            this.patients;
        });
      }

}
