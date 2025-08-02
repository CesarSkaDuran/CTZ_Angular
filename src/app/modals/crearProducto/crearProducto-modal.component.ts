import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'vex-crearProducto-modal',
    templateUrl: './crearProducto-modal.component.html',
    styleUrls: ['./crearProducto-modal.component.scss']
})
export class CrearProductoComponent implements OnInit {
    id_producto=this.data.id_producto;
    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;
    datos: any [] = [];
    dataProducto: any [] = [];
    protected color: any[] = [];
    public patientFilterCtrl: FormControl = new FormControl();
    public filteredcolor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    protected _onDestroy = new Subject<void>();

    nombre:any;
    precio:any;
    unidad_medida:any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CrearProductoComponent>,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        if(this.id_producto){
            this.loadColor();
            this.loadProducto();
            this.dataProducto;
        }

        this.patientFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filtercolor();
            });
    }

    loadColor(callback = null) {
        console.log('loading color...');
        let queryParams = `search:""`;
        let queryProperties =
            'id, name, id_referencia';
        this.apiService.getColor(queryParams, queryProperties).subscribe(
            (response: any) => {
                console.log(response);
                this.color = response.data.color;
                this.filteredcolor.next(response.data.color.slice());
                if (callback) {
                    callback();
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    protected filtercolor() {
        if (!this.color) {
            return;
        }

        let search = this.patientFilterCtrl.value;
        if (!search) {
            this.filteredcolor.next(this.color.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredcolor.next(
            this.color.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
        );
    }
    loadProducto() {
        console.log('loading records...');
        const queryParams = `id:${this.id_producto}`;
        const queryProps =
            ' id, codigo, nombre, precio, unidad_medida';
        this.apiService.getProducto(queryParams, queryProps).subscribe(
            (response: any) => {
                //this.datos= response.data.producto;
                this.dataProducto = response.data.producto;
                this.nombre=response.data.producto[0].nombre;
                this.precio=response.data.producto[0].precio;
                this.unidad_medida=response.data.producto[0].unidad_medida;
            },
            error => {
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }
    usr = new FormGroup({
        id: new FormControl('', []),
        nombre: new FormControl('', [Validators.required]),
        unidad_medida: new FormControl('', [Validators.required]),
        precio: new FormControl('', [Validators.required]),
    });

    save() {
        this.sending = true;
        const data = this.usr.value;

        const id = `id: ${this.id_producto},`;
        const nombre = `nombre: "${data.nombre}",`;
        const unidad_medida = `unidad_medida: "${data.unidad_medida}",`;
        const precio = `precio: "${data.precio}",`;
        const queryParams = `${this.id_producto ? id : ' '} ${nombre} ${unidad_medida} ${precio}   `;
        const queryProps = 'id, nombre,';

        this.apiService.createProducto(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.close({ producto: response.data.createProducto, created: data.create_user == true });

                this._snackBar.open('Guardado', null, {
                    duration: 4000
                });
            },
            error => {
                this.sending = false;
                this._snackBar.open('Error', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

}
