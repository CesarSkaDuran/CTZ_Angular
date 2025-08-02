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

moment.locale('es');

@Component({
    selector: 'app-appointmentPlanta',
    templateUrl: './appointmentPlanta.component.html',
    styleUrls: ['./appointmentPlanta.component.scss']
})
export class AppointmentPlantaComponent implements OnInit, AfterViewInit, OnDestroy {


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
    obs = new FormGroup({
        //  value: new FormControl(0, [Validators.required]),
        //  type: new FormControl('1', [Validators.required]),
        id: new FormControl('', []),
        date: new FormControl('', [Validators.required]),
        //patient: new FormControl('', [Validators.required]),
        time: new FormControl('', [Validators.required]),
        end_time: new FormControl('-:-- --', []),
        status: new FormControl('1', [Validators.required]),
        cliente: new FormControl('', []),
        metros: new FormControl('', [Validators.required]),
        type_concreto: new FormControl('', []),
        direccion: new FormControl('', [Validators.required]),
        vendedor: new FormControl('sin vendedor', []),
        conductor: new FormControl('sin conductor', []),
        observaciones: new FormControl('', []),
        tipo_descarga: new FormControl('', []),
    });

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


    constructor(
        public dialogRef: MatDialogRef<AppointmentPlantaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private coreService: CoreService,
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }


    loadRecords() {
        this.tableData.push(this.data.appointment);

    }

    ngOnInit() {
        console.log(this.data.appointment);
        this.loadRecords();
        if (this.data.appointment) {
            this.obs.setValue({
                id: this.data.appointment.id ? this.data.appointment.id : null,
                // patient: this.data.appointment.id ? this.data.appointment.id : null,
                cliente: this.data.appointment.cliente ? this.data.appointment.cliente : null,
                date: this.data.appointment.date ? this.data.appointment.date: new Date(),
                metros: this.data.appointment.metros ? this.data.appointment.metros : null,
                time: this.data.appointment.time ? this.data.appointment.time : null,
                type_concreto: this.data.appointment.type_concreto ? this.data.appointment.type_concreto : null,
                // type: this.data.appointment.type ? this.data.appointment.type  : '1',
                direccion: this.data.appointment.direccion ? this.data.appointment.direccion : null,
                end_time: this.data.appointment.end_time ? this.data.appointment.end_time : null,
                vendedor: this.data.appointment.vendedor ? this.data.appointment.vendedor : null,
                conductor: this.data.appointment.conductor ? this.data.appointment.conductor : null,
                observaciones: this.data.appointment.observaciones ? this.data.appointment.observaciones : null,
                tipo_descarga: this.data.appointment.tipo_descarga ? this.data.appointment.tipo_descarga.toString() : null,
                status: 1
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
        return this.coreService.currentUser.permiso.crear_pedido;
    }

    userPermisoStatus() {
        return this.coreService?.currentUser?.role?.permiso?.status;
    }

    ngAfterViewInit() { }

    save() {
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
        const time = `time: "${data.time}",`;
        const end_time = `end_time: "${data.end_time}",`;
        const direccion = `direccion: "${data.direccion}",`;
        const observaciones = `observaciones: "${data.observaciones}",`;
        //const observaciones = `observaciones: "${data.observaciones}",`;
        const tipo_descarga = `tipo_descarga: "${data.tipo_descarga}",`;
        const vendedor = this.data.appointment ? `vendedor: "${this.data.appointment.vendedor}",` : `vendedor: "${data.vendedor.name}",`;
        //const conductor = `conductor: "${data.conductor.name}",`;
        const queryParams = ` ${id}  ${name} ${metros} ${type_concreto} ${date} ${time} ${end_time} ${patient_id} ${status} ${direccion} ${vendedor} ${observaciones} ${tipo_descarga}`;
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
                this.save();
                this.close(true);
            }
            //   this.loadclientes();
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
