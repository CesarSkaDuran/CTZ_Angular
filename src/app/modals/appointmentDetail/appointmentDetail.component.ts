import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';
import { UserAddModalComponent } from '../userAddModal/user-add-modal.component';
import { ClienteModalComponent } from '../cliente/cliente-modal.component';
import { VendedorModalComponent } from '../vendedor/vendedor-modal.component';
import { CambiarProductoModalComponent } from '../cambiarProductor/cambiarProducto-modal.component';
import { CrearProductoComponent } from '../crearProducto/crearProducto-modal.component';
import { Router } from '@angular/router';
import { NuevoVendedorComponent } from '../crearVendedor/nuevo-vendedor-modal.component';
import { NuevoConductorComponent } from '../crearConductor/nuevo-conductor-modal.component';
import { CoreService } from 'src/app/core/core.service';
import { AppointmentConductorComponent } from '../appointmentConductor/appointmentConductor.component';
import baselineAutorenew from '@iconify/icons-ic/baseline-autorenew';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

moment.locale('es');

@Component({
    selector: 'app-appointmentDetail',
    templateUrl: './appointmentDetail.component.html',
    styleUrls: ['./appointmentDetail.component.scss']
})
export class AppointmentDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    previewImageSafeUrl: SafeUrl;

    protected cliente: any[] = [];

    protected clientes: any[] = [];

    protected conductor: any[] = [];

    protected vendedor: any[] = [];

    protected producto: any[] = [];

    protected patients: any[] = [];
    baselineAutorenew = baselineAutorenew;
    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;
    tableData: any[] = [];
    dataBloqueo: any []=[];
    loadingRecords = false;
    dataAppointment: any []=[];


    items: any[] = [];

    public productoFilterCtrl: FormControl = new FormControl();

    public vendedorFilterCtrl: FormControl = new FormControl();

    public conductorFilterCtrl: FormControl = new FormControl();

    public patientFilterCtrl: FormControl = new FormControl();

    public filteredclientes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    public filteredconductor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    public filteredvendedor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    public filteredproducto: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    public patient1FilterCtrl: FormControl = new FormControl();

    public filteredPatients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    protected _onDestroy = new Subject<void>();
    usuario: any;
    role: any = '';
    obs: FormGroup;


    constructor(
        public dialogRef: MatDialogRef<AppointmentDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private coreService: CoreService,
        private sanitizer: DomSanitizer
    ) {
        var usuarioJSON = localStorage.getItem('current_user');
        var usuario = JSON.parse(usuarioJSON);
        this.usuario = usuario
        this.role = this.usuario.role.role; 
        // this.googleMapsEmbedUrl = this.getSafeUrl(this.lat, this.lng);

    }

    setPreviewImage(base64Data: string) {
        const imageUrl =  base64Data;
        this.previewImageSafeUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
 
    getSafeUrl(lat: number, lng: number): SafeResourceUrl {
        const url = `https://www.google.com/maps/embed/v1/view?key=TU_API_KEY&center=${lat},${lng}&zoom=16`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    get googleMapsUrl(): string {
        if (this.data.appointment.coordenadas != '' &&
            this.data.appointment.coordenadas != null &&
            this.data.appointment.coordenadas != 'null' &&
            this.data.appointment.coordenadas != '0' 
         )
        {
            const coords = this.data.appointment.coordenadas
            const [latStr, lngStr] = coords.split(',');

            const lat = parseFloat(latStr.trim());
            const lng = parseFloat(lngStr.trim());
            return `https://www.google.com/maps?q=${lat},${lng}`;
        }

    }

    loadRecords() {
        this.tableData.push(this.data.appointment);

    }

    getDias(fecha_pago){
        const hoy = moment().format("YYYY-MM-DD");
        const fecha = moment(fecha_pago);
        return fecha.diff(hoy, 'days');
    }
    previewImage: string | null = null;
    base64Image: string = '';
    tieneImagenGuardada = false;


    ngAfterViewInit(): void {

    }

    googleMapsEmbedUrl: SafeResourceUrl;

    ngOnInit() {
        console.log('this.data.appointment',this.data.appointment);
        const imagenGuardada = this.data.appointment?.imagen;
        this.setPreviewImage(imagenGuardada)
        if (imagenGuardada) {
            this.previewImage = 'data:image/jpeg;base64,' + imagenGuardada; // o simplemente la URL si no es base64
            this.base64Image = imagenGuardada;
            this.tieneImagenGuardada = true;
        }
     
        this.loadRecords();
        this.obs = new FormGroup({
            id: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
            date: new FormControl({ value: '', disabled: this.role != 'Administrador' }, [Validators.required]),
            time: new FormControl({ value: '', disabled: this.role != 'Administrador' }, [Validators.required]),
            end_time: new FormControl({ value: '-:-- --', disabled: this.role != 'Administrador' }, []),
            status: new FormControl({ value: '2', disabled: this.role === 'consulta' }, [Validators.required]),
            cliente: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
            metros: new FormControl({ value: '', disabled: this.role === 'consulta' }, [Validators.required]),
            type_concreto: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
            direccion: new FormControl({ value: '', disabled: this.role != 'Administrador' }, [Validators.required]),
            vendedor: new FormControl({ value: 'sin vendedor', disabled: this.role != 'Administrador' }, []),
            conductor: new FormControl({ value: 'sin conductor', disabled: this.role != 'Administrador' }, []),
            observaciones: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
            tipo_descarga: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
            dias_pago: new FormControl({ value: '', disabled: this.role != 'Administrador' }, [Validators.required]),
            coordenadas: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
            imagen: new FormControl({ value: '', disabled: this.role != 'Administrador' }, []),
        });
        if (this.data.appointment) {
            this.obs.setValue({
                id: this.data.appointment.id ? this.data.appointment.id : null,
                // patient: this.data.appointment.id ? this.data.appointment.id : null,
                cliente: this.data.appointment.cliente ? this.data.appointment.cliente  : null,
                date: this.data.appointment.date ? this.data.appointment.date  : new Date(),
                metros: this.data.appointment.metros ? this.data.appointment.metros  : null,
                dias_pago: this.data.appointment.fecha_pago ? this.getDias(this.data.appointment.fecha_pago)  : null,
                time: this.data.appointment.time ? this.data.appointment.time  : null,
                type_concreto: this.data.appointment.type_concreto ? this.data.appointment.type_concreto  : null,
                // type: this.data.appointment.type ? this.data.appointment.type  : '1',
                direccion: this.data.appointment.direccion ? this.data.appointment.direccion  : null,
                end_time: this.data.appointment.end_time ? this.data.appointment.end_time  : null,
                vendedor: this.data.appointment.vendedor ? this.data.appointment.vendedor  : null,
                conductor: this.data.appointment.conductor ? this.data.appointment.conductor : null,
                observaciones: this.data.appointment.observaciones ? this.data.appointment.observaciones  : null,
                tipo_descarga: this.data.appointment.tipo_descarga ? this.data.appointment.tipo_descarga.toString() : null,
                status: this.data.appointment.status ? this.data.appointment.status.toString() : null,
                coordenadas: this.data.appointment.coordenadas ? this.data.appointment.coordenadas : null,
                imagen: this.data.appointment.imagen ? this.data.appointment.imagen : null,
            });

            if (this.data.appointment.id) {
                this.showOnlyName = true;
                this.editing = true;
            }
        } else {
            this.obs.controls.date.setValue(new Date());
        }
        this.loadPatients();
        this.loadclientes();
        this.loadConductor();
        this.loadVendedor();
        this.loadProducto();
        console.log('conductores', this.conductor)
        // listen for search field value changes
        this.patient1FilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterPatients();
            });
        this.patientFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterclientes();
            });

        this.conductorFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterConductor();
            });

        this.vendedorFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterConductor();
            });
        this.productoFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterConductor();
            });
    }
    userPermisoCrear() {
        return this.coreService?.currentUser?.role?.permiso?.crear_pedido;
    }

    userPermisoStatus() {
        return this.coreService?.currentUser?.role?.permiso?.status;
    }



     
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            if (file.type.startsWith('image/')) {
                const compressed = await this.compressImage(reader.result as string, 300, 300);
                this.previewImage = compressed;
                this.base64Image = compressed.split(',')[1];
            } else {
                this.previewImage = null;
                this.base64Image = (reader.result as string).split(',')[1];
            }

            this.tieneImagenGuardada = false; // ahora es una imagen nueva
            input.value = ''; // limpia el input para permitir seleccionar el mismo archivo después
        };
        reader.readAsDataURL(file);
    }

    compressImage(base64: string, maxWidth: number, maxHeight: number): Promise<string> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Escala proporcional
                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width = width * scale;
                    height = height * scale;
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // calidad 70%
                resolve(compressedBase64);
            };
            img.src = base64;
        });
    }


    removeImage(): void {
        this.previewImage = null;
        this.base64Image = '';
        this.tieneImagenGuardada = false;
    }
loadBloqueo(){

    console.log('loading records...');
    this.loadingRecords = true;
    const data = this.obs.value;
    //const date =  `dia_creado: "${moment(data.date).format('YYYY-MM-DD')}",`;
    const queryParams = `date:"${moment(data.date).format('YYYY-MM-DD')}"`;
    const queryProps =
        'id, id_usuario, fecha, nombreusuario';
    this.apiService.getBloqueo(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataBloqueo = response.data.bloqueo;
            console.log("Estos son los bloqueos:");
            console.log(response.data.bloqueo);

            if(response.data.bloqueo.length>0){
                this.loadingRecords = false;
                this.snackBar.open('Día cerrado', null, {
                    duration: 4000
                });

            }else{
                this.save();
            }
        },
        error => {
            this.loadingRecords = false;
            this.snackBar.open('Error.', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
  }

    save() {
        this.obs.enable()
        this.sending = true;
        const data = this.obs.value;

        console.log(data);

        const id = this.data.appointment ? `id: ${data.id},` : '';
     //   const app_user_id = this.data.appointment ? `app_user_id: ${this.data.appointment.app_user_id},` : `app_user_id: ${data.vendedor.id}`;
        const patient_id = this.data.appointment ? '' : `patient_id: ${data.cliente.id},`;
        const status = `status: ${data.status},`;
        const name = this.data.appointment ? `name: "${this.data.appointment.name}",` : `name: "${data.cliente.name}",`;
        const type_concreto = this.data.appointment ? `type_concreto: "${this.data.appointment.type_concreto}",` : `type_concreto:"${data.type_concreto.nombre}",`;
        const metros = `metros: "${data.metros}",`;
        const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
        const fecha_pago =  `fecha_pago: "${moment().add(data.dias_pago, 'days').format("YYYY-MM-DD")}",`;
        const time = `time: "${data.time}",`;
        const end_time = `end_time: "${data.end_time}",`;
        const direccion = `direccion: "${data.direccion}",`;
        const observaciones = `observaciones: "${data.observaciones}",`;
        const coordenadas = `coordenadas: "${data.coordenadas}",`;
        const imagen = `imagen: "${this.previewImageSafeUrl || null}",`;
        const tipo_descarga = `tipo_descarga: "${data.tipo_descarga}",`;
        const vendedor = this.data.appointment ? `vendedor: "${this.data.appointment.vendedor}",` : `vendedor: "${data.vendedor.name}",`;
        //const conductor =`conductor: "${data.conductor.name}",`;
        const queryParams = ` ${id}  ${name} ${fecha_pago} ${metros} ${type_concreto} ${date} ${time} ${end_time} ${patient_id} ${status} ${direccion} ${vendedor} ${observaciones} ${tipo_descarga} ${coordenadas} ${imagen}`;
        const queryProps = 'id, conductor, tipo_descarga, observaciones';

        this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(data);
                //  this.router.navigate(['/app/home']);
                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });
            },
            error => {
                this.sending = false;
                this.snackBar.open('cambia las comillas dobles por simples.', null, {
                    duration: 4000
                });
                this.obs.disable()
                console.log(error);
            }
        );
    }
    protected filterPatients() {
        if (!this.patients) {
            return;
        }
        // get the search keyword
        let search = this.patient1FilterCtrl.value;
        if (!search) {
            this.filteredPatients.next(this.patients.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredPatients.next(
            this.patients.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );
    }
    loadPatients(callback = null) {
        console.log('loading patients...');

        let queryParams = `status:""`;
        let queryProperties =
            'id, name, phone, identity, created_at user{ id, email } ';

        this.apiService.getPatients(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.patients = response.data.appPatient;
                this.filteredPatients.next(response.data.appPatient.slice());

                if (callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    openNewPatient(): void {
        const dialogRef = this.dialog.open(PatientFormModalComponent, {
            width: '500px',
            height: 'auto',
            maxHeight: '800px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                this.loadPatients(() => {
                    let match = this.patients.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log('datos para el modal', this.patients);

                    if (match.length > 0) {
                        this.obs.controls.vendedor.setValue(match[0]);
                    }
                });
            }
            //    this.loadclientes();
        });
        //this.close(true);
    }

    loadclientes(callback = null) {
        console.log('loading clientes...');

        let queryParams = `search:""`;
        let queryProperties =
            'id, name';

        this.apiService.getClientes(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.clientes = response.data.cliente;
                this.filteredclientes.next(response.data.cliente.slice());

                if (callback) {
                    callback();
                }
            },

            error => {
                console.log(error);
            }
        );
    }

    loadConductor(callback = null) {
        console.log('loading clientes...');

        let queryParams = `search:""`;
        let queryProperties =
            'id, name, placa';

        this.apiService.getConductor(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.conductor = response.data.conductor;
                this.filteredconductor.next(response.data.conductor.slice());

                if (callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    loadVendedor(callback = null) {
        console.log('loading clientes...');

        let queryParams = `search:""`;
        let queryProperties =
            'id, name';

        this.apiService.getVendedores(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.vendedor = response.data.vendedores;
                this.filteredvendedor.next(response.data.vendedores.slice());

                if (callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    loadProducto(callback = null) {
        console.log('loading clientes...');

        let queryParams = `search:""`;
        let queryProperties =
            'id, nombre';

        this.apiService.getProducto(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.producto = response.data.producto;
                this.filteredproducto.next(response.data.producto.slice());

                if (callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    protected filterclientes() {
        if (!this.clientes) {
            return;
        }
        // get the search keyword
        let search = this.patientFilterCtrl.value;
        if (!search) {
            this.filteredclientes.next(this.clientes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredclientes.next(
            this.clientes.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterConductor() {
        if (!this.conductor) {
            return;
        }
        // get the search keyword
        let search = this.conductorFilterCtrl.value;
        if (!search) {
            this.filteredconductor.next(this.conductor.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredconductor.next(
            this.conductor.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );

    }
    protected filterVendedor() {
        if (!this.vendedor) {
            return;
        }
        // get the search keyword
        let search = this.productoFilterCtrl.value;
        if (!search) {
            this.filteredvendedor.next(this.vendedor.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredvendedor.next(
            this.vendedor.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );

    }
    protected filterProducto() {
        if (!this.producto) {
            return;
        }
        // get the search keyword
        let search = this.productoFilterCtrl.value;
        if (!search) {
            this.filteredproducto.next(this.producto.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredproducto.next(
            this.producto.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );

    }
    openUserAddModal(): void {
        const dialogRef = this.dialog.open(UserAddModalComponent, {
            width: '500px',
            height: '600px',
            maxHeight: '700px',

        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                this.loadclientes(() => {
                    let match = this.clientes.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log('datos para el modal', this.clientes);

                    if (match.length > 0) {
                        this.obs.controls.cliente.setValue(match[0]);
                    }
                });
            }
            //    this.loadclientes();
        });
        //this.close(true);
    }

    // openNewPatient(): void {
    //     const dialogRef = this.dialog.open(PatientFormModalComponent, {
    //         width: '500px',
    //         height: 'auto',
    //         maxHeight: '800px'
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('clientes form closed');
    //         if (result) {
    //             this.loadclientes(() => {
    //                 let match = this.clientes.filter((value) => {
    //                     return value.id == result.id;
    //                 });

    //                 console.log(match);
    //                 console.log(result);
    //                 console.log('datos para el modal',this.clientes);

    //                 if (match.length > 0) {
    //                     this.obs.controls.cliente.setValue(match[0]);
    //                 }
    //             });
    //         }
    //         //    this.loadclientes();
    //     });
    //     this.close(true);
    // }
    openNewProductot(): void {
        const dialogRef = this.dialog.open(CrearProductoComponent, {
            width: '500px',
            height: 'auto',
            maxHeight: '800px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {

                this.loadProducto(() => {
                    let match = this.producto.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log(this.producto);

                    if (match.length > 0) {
                        this.obs.controls.type_concreto.setValue(match[0]);
                    }
                });
            }
            //    this.loadclientes();
        });

    }
    crearConductor(appointment: any = null): void {
        const dialogRef = this.dialog.open(NuevoConductorComponent, {
            width: '500px',
            height: 'auto',

            data: {
                appointment
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                // this.close(true);
                this.loadConductor(() => {
                    let match = this.conductor.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log(this.conductor);

                    if (match.length > 0) {
                        this.obs.controls.conductor.setValue(match[0]);
                    }
                });
            }
            //   this.loadclientes();
        });
    }
    crearVendedor(appointment: any = null): void {
        const dialogRef = this.dialog.open(NuevoVendedorComponent, {
            width: '500px',
            height: 'auto',

            data: {
                appointment
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                // this.close(true);
                this.loadVendedor(() => {
                    let match = this.vendedor.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log(this.vendedor);

                    if (match.length > 0) {
                        this.obs.controls.vendedor.setValue(match[0]);
                    }
                });
            }
            //   this.loadclientes();
        });
    }
    selectNewPatient(appointment: any = null): void {
        const dialogRef = this.dialog.open(ClienteModalComponent, {
            width: '500px',
            height: 'auto',

            data: {
                appointment
            }
        });



        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                // this.close(true);
                this.loadclientes(() => {
                    let match = this.clientes.filter((value) => {
                        return value.id == result.id;
                    });

                    console.log(match);
                    console.log(result);
                    console.log(this.clientes);

                    if (match.length > 0) {
                        this.obs.controls.cliente.setValue(match[0]);
                    }
                });
            }
            //   this.loadclientes();
        });
    }
    selectNewConductor(appointment: any = null): void {
        const dialogRef = this.dialog.open(AppointmentConductorComponent, {
            width: '500px',
            height: 'auto',

            data: {
                appointment
            }
        });
      dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                this.close(true);
            }
            //   this.loadclientes();
        });
    }

    selectNewProducto(appointment: any = null): void {
        const dialogRef = this.dialog.open(CambiarProductoModalComponent, {
            width: '500px',
            height: 'auto',

            data: {
                appointment
            }
        });



        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {

                this.close(true);

            }
            //    this.loadclientes();
        });
    }
    selectNewVendedor(appointment: any = null): void {
        const dialogRef = this.dialog.open(VendedorModalComponent, {
            width: '500px',
            height: 'auto',

            data: {
                appointment
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('clientes form closed');
            if (result) {
                this.close(true);
                // dialogRef.afterClosed().subscribe(result => {
                //     console.log('clientes form closed');
                //     if (result) {
                //         this.loadPatients(() => {
                //             let match = this.patients.filter((value) => {
                //                 return value.id == result.id;
                //             });

                //             console.log(match);
                //             console.log(result);
                //             console.log('datos para el modal', this.patients);

                //             if (match.length > 0) {
                //                 this.obs.controls.vendedor.setValue(match[0]);
                //             }
                //         });
                //     }
                //     //    this.loadclientes();
                // });
            }
            //    this.loadclientes();
        });
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }


}
