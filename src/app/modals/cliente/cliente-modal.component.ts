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

moment.locale('es');

@Component({
    selector: 'app-cliente-modal',
    templateUrl: './cliente-modal.component.html',
    styleUrls: ['./cliente-modal.component.scss']
})
export class ClienteModalComponent implements OnInit, AfterViewInit, OnDestroy {


    protected cliente: any[] = [];

    protected clientes: any[] = [];

    protected conductor: any[] = [];

    protected vendedor: any[] = [];

    protected producto: any[] = [];

    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;
    tableData: any[] = [];
    obs = new FormGroup({
        //  value: new FormControl(0, [Validators.required]),
        //  type: new FormControl('1', [Validators.required]),
        id: new FormControl('', []),
        //patient: new FormControl('', [Validators.required]),

        cliente: new FormControl('', [Validators.required]),
  
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

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    protected _onDestroy = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<ClienteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    openUserAddModal(appointment: any = null) {
        const dialogRef = this.dialog.open(UserAddModalComponent, {
            width: '500px',
            height: '600px',
            maxHeight: '700px',
            data: {
                appointment
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
        });
    }
    loadRecords() {
        this.tableData.push(this.data.appointment.id);

    }

    ngOnInit() {
        console.log(this.data.appointment);
        this.loadclientes();
        this.loadConductor();
        this.loadVendedor();
        this.loadProducto();
        console.log('conductores', this.conductor)
        // listen for search field value changes
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

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;

        console.log(data);

        const id = `id: ${this.data.appointment.id},`;
        const patient_id = `patient_id: ${data.cliente.id}`;
        // const status = `status: ${data.status},`;
        const name =  `name: "${data.cliente.name}",`;
        // const type_concreto = this.data.appointment ? `type_concreto: "${this.data.appointment.type_concreto}",` : `type_concreto:"${data.type_concreto.nombre}",`;
        // const metros = `metros: "${data.metros}",`;
        // const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
        // const time = `time: "${data.time}",`;
        // const end_time = `end_time: "${data.end_time}",`;
        // const direccion = `direccion: "${data.direccion}",`;
        // const vendedor = this.data.appointment ? `vendedor: "${this.data.appointment.vendedor}",` : `vendedor: "${data.vendedor.name}",`;
        // const conductor = `conductor: "${data.conductor.name}",`;
        const queryParams = ` ${id}  ${name} ${patient_id}`;
        const queryProps = 'id, name';

        this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close(data);

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

    openNewPatient(): void {
        const dialogRef = this.dialog.open(PatientFormModalComponent, {
            width: '500px',
            height: '562px',
            maxHeight: '800px'
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
                    console.log(this.clientes);

                    if (match.length > 0) {
                        this.obs.controls.patient.setValue(match[0]);
                    }
                });
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
