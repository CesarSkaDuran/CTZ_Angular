import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, tap, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'vex-nuevo-vendedor-modal',
    templateUrl: './nuevo-vendedor-modal.component.html',
    styleUrls: ['./nuevo-vendedor-modal.component.scss']
})
export class NuevoVendedorComponent implements OnInit, OnDestroy {
    sending = false;
    id_vendedor=this.data.id_vendedor;
    loadingRecords=false;
    dataPatients: any []=[];
    name:any;
    email:any;
    user:string;
    phone:any;
    cedula:any;
    public searchingProcedures = false;
    dataUser: any []=[];



    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NuevoVendedorComponent>,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) { }



    procFilterCtrl: FormControl = new FormControl();

    protected _onDestroy = new Subject<void>();
  
  
    public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


    ngOnDestroy(): void { }



      
  loadUser() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `todo:1`;
    const queryProps =
        'id, name, email, role_id';
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


    ngOnInit(): void {

        if(this.id_vendedor){
            this.vendedorFormGroup.get('password').clearValidators();
          }

        this.loadUser();
        this.dataUser;

        if(this.id_vendedor){
            this.loadPatients();
            this.dataPatients;
        }

    }

    vendedorFormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        cedula: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });



    loadPatients() {
        console.log('loading records...');
        this.loadingRecords = true;

        const id = this.id_vendedor != '' ? `id: ${this.id_vendedor},` : '';
        const queryParams = `${id}`;
        const queryProps =
            'id, name, email, user_id, identity, phone';

        this.apiService.getPatients(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataPatients = response.data.appPatient;
                this.name=response.data.appPatient[0].name;
                this.email=response.data.appPatient[0].email;
                this.phone=response.data.appPatient[0].phone;
                this.cedula=response.data.appPatient[0].identity;

                this.vendedorFormGroup.patchValue({
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    cedula: this.cedula
                });

                console.log("User id");
                console.log(this.user);

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



    save() {
        this.sending = true;
        const data = this.vendedorFormGroup.value;
        console.log(data);
        const id = `id: ${this.id_vendedor},`;
        const name = `name: "${data.name}",`;
        const telefono = `phone: "${data.phone}",`;
        const email = `email: "${data.email}",`;
        const cedula = `identity: "${data.cedula}",`;
        const password = data.password?`password: "${data.password}",`:``;
        const queryParams = `${this.id_vendedor ? id : ''} ${password} ${name} ${email} ${telefono} ${cedula}`;
        const queryProps = 'id';

        this.apiService.savePatient(queryParams, queryProps).subscribe(
            (response: any) => {
                this.sending = false;

                this.apiService.setRecord(response.data.saveRecord);

                this.close();

                this.snackBar.open('Guardado', null, {
                  duration: 4000
                });
            },
            error => {
                this.sending = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }

    close(params: any = null) {
        this.dialogRef.close();
    }

}
