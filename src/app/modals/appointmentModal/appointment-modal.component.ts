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
import { RegistrarClienteModalComponent } from '../registrarClienteModal/registrar-cliente-modal.component';

moment.locale('es');

@Component({
    selector: 'app-appointment-modal',
    templateUrl: './appointment-modal.component.html',
    styleUrls: ['./appointment-modal.component.scss']
})
export class AppointmentModalComponent implements OnInit, AfterViewInit, OnDestroy {


    protected cliente: any[] = [];

    protected clientes: any[] = [];
   
    protected conductor: any []= [];
    
    protected vendedor: any []= [];

    protected producto: any[] = [];

    protected patients: any[] = [];
    

    loadingRecords = false;
    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;
    tableData: any[] = [];
    dataAppointment: any[] = [];
    baselineAutorenew = baselineAutorenew;
    dataBloqueo: any []=[];
    dataProducto: any []=[];
    cliente_id=this.data.cliente_id;
    cliente_seleccionado_id:any;
    cliente_seleccionado_nombre:any;

    obs = new FormGroup({
        id: new FormControl('', []),
        date: new FormControl('', [Validators.required]),
        time: new FormControl('', [Validators.required]),
        end_time: new FormControl('-:-- --', [Validators.required]),
        status: new FormControl('2', [Validators.required]),
        cliente: new FormControl('', [Validators.required]),
        metros: new FormControl('', [Validators.required]),
        type_concreto: new FormControl('', [Validators.required]),
        direccion: new FormControl('', [Validators.required]),
        vendedor: new FormControl('sin vendedor', [Validators.required]),
        conductor: new FormControl('sin conductor', []),
        observaciones: new FormControl('', [Validators.required]),
        tipo_descarga: new FormControl('', [Validators.required]),
        valor: new FormControl('', [Validators.required]),
        dias_pago: new FormControl('', [Validators.required]),
        coordenadas: new FormControl('', []),
        imagen: new FormControl('', []),
    });
    producto_precio: any;
    valor_estatico_producto: number;


    getClientes(cliente){
        this.cliente_seleccionado_id = cliente.id;
        this.cliente_seleccionado_nombre = cliente.name;
    }


    eliminarValidatorCliente(){
        this.obs.get('cliente').clearValidators();
    }

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

    valor_calculado = 0;

    ultimo_producto_seleccionado = null;
    valor_producto = null;


    constructor(
        public dialogRef: MatDialogRef<AppointmentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private coreService: CoreService,
        private _snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
  
    actualizarValor(valor_producto = null){
        const data = this.obs.value;

        //this.valor_producto = data.metros;
        //valor_producto?this.ultimo_producto_seleccionado = valor_producto:

        const metros = data.metros != null && data.metros != undefined && data.metros != '' ? data.metros : 0;
        const valor = valor_producto ? valor_producto : this.ultimo_producto_seleccionado?this.ultimo_producto_seleccionado:0;

        this.valor_producto=valor_producto;

        if(valor_producto){
            this.ultimo_producto_seleccionado=valor_producto;
        }


        
        this.valor_calculado = metros*valor;
        this.valor_estatico_producto = valor;
        
        console.log("El valor calculado es:");
        console.log(this.valor_calculado);

        //this.obs.patchValue({valor: this.data.estado_despacho});

    }

    loadRecords() {
        this.tableData.push(this.data.appointment);
    }
    

    ngOnInit() {

        if (this.cliente_id) {
            this.eliminarValidatorCliente();   
        }
        console.log(this.data.appointment);
        this.loadRecords();



       if (this.data.appointment) {
            this.obs.setValue({
                id: this.data.appointment.id ? this.data.appointment.id : null,
               // patient: this.data.appointment.id ? this.data.appointment.id : null,
                cliente: this.data.appointment.cliente ? this.data.appointment.cliente : null,
                date: this.data.appointment.date ? this.data.appointment.date : new Date(),
                metros: this.data.appointment.metros ? this.data.appointment.metros : null,
                time: this.data.appointment.time ? this.data.appointment.time : null,
                type_concreto: this.data.appointment.type_concreto ? this.data.appointment.type_concreto : null,
               // type: this.data.appointment.type ? this.data.appointment.type : '1',
                direccion: this.data.appointment.direccion ? this.data.appointment.direccion : null,
                end_time: this.data.appointment.end_time ? this.data.appointment.end_time : null,
                vendedor: this.data.appointment.vendedor ? this.data.appointment.vendedor : null,
                conductor: this.data.appointment.conductor ? this.data.appointment.conductor : null,
                observaciones: this.data.appointment.observaciones ? this.data.appointment.observaciones : null,
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
        console.log('conductores', this.conductor )
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


    loadAppointment() {
        console.log('loading records...');
        this.loadingRecords = true;

        const data = this.obs.value;
        const date =  `dia_creado: "${moment(data.date).format('YYYY-MM-DD')}",`;
        const time = `hora_creada: "${data.time}",`;

        const searchText = "";
        const queryParams = `${time}`;
        const queryProps =
            ' id, name, company, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, patient{ id, name, color  }, doctor{ id, name, }';
        this.apiService.getAppointmentMonth(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataAppointment=response.data.appointmentMonth;
                
                if(response.data.appointmentMonth.length>0){
                    this.loadingRecords = false;
                    this._snackBar.open('Hora de cargue no disponible', null, {
                        duration: 4000
                    });
                }else{
                    this.save();
                }
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
                this._snackBar.open('Día cerrado', null, {
                    duration: 4000
                });

            }else{
                this.loadAppointment();
            }
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

    userPermisoCrear() {
        return this.coreService.currentUser.role.permiso.crear_pedido;
    }

    userPermisoStatus() {
        return this.coreService.currentUser.role.permiso.status;
    }

    userId() {
        return this.coreService.currentUser.id;
    }

    userName() {
        return this.coreService.currentUser.name;
    }

    ngAfterViewInit() { }

    compressImage(base64: string, maxWidth: number, maxHeight: number, quality: number = 0.5): Promise<string> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Escala proporcional siempre
                const scale = Math.min(maxWidth / width, maxHeight / height, 1); // '1' evita agrandar imágenes pequeñas
                width = width * scale;
                height = height * scale;

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', quality); // calidad ajustable
                resolve(compressedBase64);
            };

            img.onerror = () => {
                console.error('Error cargando imagen base64');
                resolve(base64); // fallback en caso de error
            };

            img.src = base64;
        });
    }



    previewImage: string | null = null;
    base64Image: string | null = null;

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            if (file.type.startsWith('image/')) {
                // Comprimir si es imagen (reduce tamaño)
                const compressed = await this.compressImage(reader.result as string, 300, 300, 0.5); // 30% calidad

                this.previewImage = compressed;
                this.base64Image = compressed.split(',')[1]; // solo el base64 sin encabezado
            } else {
                // Si es PDF, deja el base64 como está
                this.previewImage = null;
                this.base64Image = (reader.result as string).split(',')[1];
            }
        };
        reader.readAsDataURL(file);
    }

    removeImage(): void {
        this.previewImage = null;
        this.base64Image = null;
    }



    save() {
        this.sending = true;
        const data = this.obs.value;

        var patient_id;
        var name;

        if(this.cliente_id){
            patient_id=`patient_id: ${this.cliente_id},`;
            name=`name: "${this.userName()}",`;
        }else{
            patient_id = `patient_id: ${this.cliente_seleccionado_id},`;
            name=`name: "${this.cliente_seleccionado_nombre}",`;
        }

        

        const id = this.data.appointment ? `id: ${data.id},` : '';
        const app_user_id = this.data.appointment ? `app_user_id: ${this.data.appointment.app_user_id},` : `app_user_id: ${data.vendedor.id},`;
        const status = `status: ${data.status},`;
        const estado_despacho = `estado_despacho: 1,`;
        const user_id = this.userId() ? `user_id: ${this.userId()},`  : `user_id: "${this.userId()}",`;
        const type_concreto = this.data.appointment ? `type_concreto: "${this.data.appointment.type_concreto}",` : `type_concreto:"${data.type_concreto.nombre}",`;
        const id_type_concreto = this.data.appointment ? `id_type_concreto: ${this.data.appointment.id_type_concreto},` : `id_type_concreto:${data.type_concreto.id},`;
        const metros = `metros: "${data.metros}",`;
        const date =  `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
        const fecha_pago =  `fecha_pago: "${moment().add(data.dias_pago, 'days').format("YYYY-MM-DD")}",`;
        const time = `time: "${data.time}",`;
        const aprobado = `aprobado: 1,`;
        const end_time =  `end_time: "${data.end_time}",`;
        const direccion = `direccion: "${data.direccion}",`;
        const observaciones = `observaciones: "${data.observaciones}",`;
        const coordenadas = `coordenadas: "${data.coordenadas}",`;
        const imagen = `imagen: "${this.previewImage}",`;
        const tipo_descarga = `tipo_descarga: "${data.tipo_descarga}",` ;
        const vendedor = this.data.appointment ? `vendedor: "${this.data.appointment.vendedor}",` :`vendedor: "${data.vendedor.name}",`;
        const conductor = this.data.appointment ? `conductor: "${this.data.appointment.conductor}",` : `conductor: "${data.conductor.name}",`;
        const queryParams = ` ${id} ${aprobado}  ${name} ${metros} ${fecha_pago} ${type_concreto} ${id_type_concreto} ${date} ${time} ${app_user_id} ${end_time} ${patient_id} ${status} ${estado_despacho} ${direccion} ${vendedor} ${conductor} ${observaciones} ${tipo_descarga} ${user_id} ${coordenadas}, ${imagen}`;
        const queryProps = 'id, metros';

        console.log("queryprops------------------------------------");
        console.log(queryParams);

        this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;
                console.log("Appointment recién creado:");
                console.log(response.data.createAppointmentCtz.id);
                this.saveCredito(response.data.createAppointmentCtz.id, data.valor);
                this.close(data);

                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });
            },
            error => {
                this.sending = false;
                this.snackBar.open(error, null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }



    loadProductoSeleccionado(id_concreto, id_pedido_creado, m3_pedido) {
        console.log('loading records...');
        this.loadingRecords = true;
        const queryParams = `id:${id_concreto}`; 
        console.log(queryParams);
        const queryProps =
            'id, nombre, precio';

        this.apiService.getProducto(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataProducto = response.data.producto;
                this.producto_precio = response.data.producto.precio;
                const resultado = m3_pedido * response.data.producto[0].precio;
                this.saveCredito(id_pedido_creado, resultado);

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




    saveCredito(id_pedido_creado, valor_pedido_credito) {
        this.sending = true;
        const data = this.obs.value;

        console.log(data);

        //const id = this.data.appointment ? `id: ${data.id},` : '';
        const fecha = `fecha: "${moment().format('YYYY-MM-DD')}",`;
        const pedido_id = `pedido_id: ${id_pedido_creado},`;
        const valor = `valor: "${valor_pedido_credito}",`;
        const abonos = " ";

        const queryParams = `${fecha} ${pedido_id} ${valor} ${abonos} estado:1`;
        const queryProps = 'id';

        this.apiService.saveCredito(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                //this.close(data);

                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });
            },
            error => {
                this.sending = false;
                this.snackBar.open('cambia las comillas dobles por simples.', null, {
                    duration: 4000
                });
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

                if(callback) {
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
            'id, nombre, precio';

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
    openUserAddModal():void {
        const dialogRef = this.dialog.open(UserAddModalComponent, {
            width: '500px',
            height: '600px',
            maxHeight: '700px',
            data:{

            }
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
            maxHeight: '800px',
            data:{

            }
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
