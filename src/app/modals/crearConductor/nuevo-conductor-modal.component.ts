import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'vex-nuevo-conductor-modal',
    templateUrl: './nuevo-conductor-modal.component.html',
    styleUrls: ['./nuevo-conductor-modal.component.scss']
})
export class NuevoConductorComponent implements OnInit {
    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;
    loadingRecords =false;
    dataConductor: any[] = [];
    id_conductor=this.data.id_conductor;
    nombre:any;
    documento:any;
    placa:any;
    telefono:any;
    email:any;
    cedula:any;
    user_id:number;
    dataUser: any []=[];


    protected color: any[] = [];

    public patientFilterCtrl: FormControl = new FormControl();

    public filteredcolor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    protected _onDestroy = new Subject<void>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NuevoConductorComponent>,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {

        if(this.id_conductor){
            this.usr.get('password').clearValidators();
        }

        this.loadUser();
        this.dataUser;

    }

    usr = new FormGroup({
        id: new FormControl('', []),
        name: new FormControl('', [Validators.required]),
        cedula: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email]),
        placa: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });


    loadUser() {
        console.log('loading records...');
        this.loadingRecords = true;
        const queryParams = `todo:1`;
        const queryProps =
            'id, name';
        this.apiService.getUser(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataUser = response.data.user;
                if(this.id_conductor){
                    this.loadConductores();
                    this.dataConductor;
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

    
    loadConductores() {
        console.log('loading records...');

        this.loadingRecords = true;
        const queryParams = `id:${this.id_conductor}`;
        const queryProps =
            'id, user_id, name, placa, email, telefono, cedula, created_at ';

        this.apiService.getConductor(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataConductor = response.data.conductor;
                console.log(response.data.conductor);
                this.nombre = response.data.conductor[0].name;
                this.placa = response.data.conductor[0].placa;
                this.cedula = response.data.conductor[0].cedula;
                this.placa = response.data.conductor[0].placa;
                this.telefono = response.data.conductor[0].telefono;
                this.email = response.data.conductor[0].email;
                this.user_id = response.data.conductor[0].user_id;
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

    getUserId(){
        return this.user_id;
    }

    save() {
        this.sending = true;
        const data = this.usr.value;
        console.log(data);
        const name = `name: "${data.name}",`;
        const cedula = `cedula: "${data.cedula}",`;
        const telefono = `telefono: "${data.telefono}",`;
        const email = `email: "${data.email}",`;
        const placa = `placa: "${data.placa}",`;
        const id = `id: ${this.id_conductor},`;
        const password = data.password ? `password: "${data.password}",`:``;

        const queryParams = `${this.id_conductor? id : " "} ${password} ${name} ${telefono} ${email} ${cedula} ${placa}`;
        const queryProps = 'id';
        this.apiService.createConductor(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                //  this.close(data);
                this.close({ conductor: response.data.createConductor, created: data.create_user == true });
                this._snackBar.open('Guardado', null, {
                    duration: 4000
                });

                // this.getNewPropect();
            },
            error => {
                this.sending = false;
                this._snackBar.open('', null, {
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
