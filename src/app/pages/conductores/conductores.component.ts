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
import { NuevoConductorComponent } from 'src/app/modals/crearConductor/nuevo-conductor-modal.component';
import { CoreService } from 'src/app/core/core.service';
// import { Alergias } from 'src/app/models/alergias';
// import { Enfermedades } from 'src/app/models/enfermedades';
// import { Medicinas } from 'src/app/models/medicinas';
// import { AlergiaModalComponent } from 'src/app/modals/alergiaModal/alergiaModal.component';
// import { PatologiaModalComponent } from 'src/app/modals/patologiaModal/patologiaModal.component';
// import { MedicinaModalComponent } from 'src/app/modals/medicinaModal/medicinaModal.component';
import edit from '@iconify/icons-fa-solid/pen-square';
import eye from '@iconify/icons-fa-solid/eye';
import { DetalleUsuariosComponent } from '../detalleUsuarios/detalle-usuarios.component';



@Component({
    selector: 'app-conductores',
    templateUrl: './conductores.component.html',
    styleUrls: ['./conductores.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class ConductoresComponent implements OnInit, AfterViewInit {
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
    displayedColumns: string[] = ['id', 'nombre', 'telefono', 'cedula', 'email', 'placa', 'date', 'options'];
    dataConductor: any[] = [];
    sales: any[] = [];
    dataPropect: any[] = [];
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
    edit=edit;
    eye=eye;
    @ViewChild('search', { static: false }) searchEl: ElementRef;



    
    filters = new FormGroup({
        search: new FormControl('', [])
    });


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
            //this.dataSource = new MatTableDataSource();
            this.loadConductores();
            this.dataConductor;
        });
    }
    @ViewChild(MatSort) sort: MatSort;
    public keyUp = new Subject<any>();
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;


    ngOnInit() {
        this.loadConductores();
        this.dataConductor;
    }


    


    editarConductoresPermiso() {
        return this.coreService.currentUser.role.permiso.editar_conductores;
    }

    verConductoresPermiso() {
        return this.coreService.currentUser.role.permiso.ver_conductores;
    }

    loadRecords() {
        this.dataAlergia = [
            {
                id: 1,
                name: 'penicilina',
                details: 'alta docis de penicilina',
                date: '2020-07-20',

            },
            {
                id: 2,
                date: '2020-07-20',
                name: 'ibuprofeno',
                details: 'reaccion alergica en la piel',

            },
        ];
    }

    loadConductores() {
        console.log('Cargando conductores');

        this.loadingRecords = true;
        //const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `${this.filters.value.search?searchText:'search:""'}`;
        const queryProps =
            'id, user{id}, photo, user_id, name, placa, email, telefono, cedula, created_at ';

        this.apiService.getConductor(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataConductor = response.data.conductor;
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




    detalleUsuarioModal(id_conductor, photo_usuario, name) {
        const dialogRef = this.dialog.open(DetalleUsuariosComponent, {
          width: '800px',
          height: '400px',
          maxHeight: '800px',
          data:{
            id_conductor:id_conductor,
            photo:photo_usuario,
            nombre:name
          }
        });
      
        dialogRef.afterClosed().subscribe((result: any) => {
            this.loadConductores();
            this.dataConductor;
        });
      }




    userPermisoCrear() {
        return this.coreService.currentUser.permiso.crear_pedido;
    }

    userPermisoStatus() {
        return this.coreService?.currentUser?.role?.permiso?.status;
    }

    ngAfterViewInit() {

    }

    dateChange(event: any) {
        //this.loadPropect();
    }

    pageChange(event: PageEvent) {

        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        //this.loadPropect();
    }


    searchKeyUp($event: KeyboardEvent): void {
        console.log("Este es el evento:");
        console.log($event);
        if ($event.code === 'KeyN' && $event.shiftKey) {
            this.filters.controls.search.setValue('');
            return;
        }
        this.keyUp.next($event);
    }


    editUser(user: any) {
        this.openPropectModal(user);
    }


    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;

        //this.loadPropect();
    }

    updateEmployee(): void {

        this.msg = 'Persona en Seguimiento';

    }
    closeAlert(): void {
        this.msg = '';
        setTimeout(() =>
            this.msg = '',
            2000);
    }

    delete(Conductor: any) {

        const r = confirm('¿ Desea eliminar el Conductor?');
        if (r === true) {
            this.loadingRecords = true;

            const id = Conductor ? `id: ${Conductor.id},` : '';
            const queryParams = `${id} delete: 1`;
            const queryProps = 'id, ';

            this.apiService.createConductor(queryParams, queryProps).subscribe(
                (response: any) => {
                    this.loadingRecords = false;

                    this.loadConductores();
                    this.dataConductor;

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

    openPropectModal(user: any = null) {
        const dialogRef = this.dialog.open(NewHistoryModalComponent, {
            width: '1024px',
            height: '600px',
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
    openNewConductorModal(id: any = null, user_id: any = null) {
        const dialogRef = this.dialog.open(NuevoConductorComponent, {
            width: '450px',
            height: 'auto',
            // maxHeight: '850px',
            data: {
                id_conductor: id,
                user_id:user_id
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            this.loadConductores();
            this.dataConductor;
            console.log(result);
        });
    }

}
