import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-user-add-modal',
  templateUrl: './user-add-modal.component.html',
  styleUrls: ['./user-add-modal.component.scss']
})
export class UserAddModalComponent implements OnInit {

  sending = false;
  selected: any = null;
  showOnlyName = false;
  editing = false;
  id_cliente = this.data.id_cliente? this.data.id_cliente : null;
  nombre = "";
  tipo_documento = "";
  direccion = "";
  telefono_empresa = "";
  telefono_contacto = "";
  email="";
  color_asignado="";
  password="";

  
  protected color: any[] = [];

  public patientFilterCtrl: FormControl = new FormControl();

  public filteredcolor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserAddModalComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    this.loadColor();

    this.patientFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtercolor();
      });

      //this.usr.controls['name'].setValue(this.nombrePorDefecto, {onlySelf: true});

      if(this.id_cliente){
        this.loadClientes();
      }

      if(this.data.id_cliente){
        this.usr.get('password').clearValidators();
      }

  }

  valoresPredefinidos(){
    this.usr.controls['name'].setValue(this.nombre, {onlySelf: true});
    this.usr.controls['tipo_documento'].setValue(this.tipo_documento, {onlySelf: true});
    this.usr.controls['telefono_empresa'].setValue(this.telefono_empresa, {onlySelf: true});
    this.usr.controls['telefono_contacto'].setValue(this.telefono_contacto, {onlySelf: true});
    this.usr.controls['direccion'].setValue(this.direccion, {onlySelf: true});
    this.usr.controls['email'].setValue(this.email, {onlySelf: true});
    this.usr.controls['color'].setValue(this.color_asignado, {onlySelf: true});
    this.usr.controls['password'].setValue(this.password, {onlySelf: true});
  }

  loadClientes() {
    console.log('loading clientes...');

    let queryParams = `id:${this.id_cliente}`;
    let queryProperties =
        'id, name, email, tipo_documento, direccion, contacto, telefono_empresa, telefono_contacto, color';

    this.apiService.getClientes(queryParams, queryProperties).subscribe(
        (response: any) => {
            console.log(response);
            this.nombre=response.data.cliente[0].name;
            this.tipo_documento=response.data.cliente[0].tipo_documento;
            this.direccion=response.data.cliente[0].direccion;
            this.telefono_empresa=response.data.cliente[0].telefono_empresa;
            this.telefono_contacto=response.data.cliente[0].telefono_contacto;
            this.email=response.data.cliente[0].email;
            this.color_asignado=response.data.cliente[0].color;
            this.valoresPredefinidos();
        },

        error => {
            console.log(error);
        }
    );
}


  
  loadColor(callback = null) {
    console.log('loading color...');

    let queryParams = `search:""`;
    let queryProperties =
      'id, name, id_referencia' ;

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
    // get the search keyword
    let search = this.patientFilterCtrl.value;
    if (!search) {
      this.filteredcolor.next(this.color.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredcolor.next(
      this.color.filter(patient => patient.name.toLowerCase().indexOf(search) > -1)
    );
  }

  usr = new FormGroup({
    name: new FormControl('', [ Validators.required]),
    tipo_documento: new FormControl('', [ Validators.required]),
    telefono_empresa	: new FormControl('', [Validators.required]),
    telefono_contacto: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    email: new FormControl('', [ Validators.email]),
    color: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  getErrorMessage() {
    return this.usr.controls.email.hasError('required')
      ? 'El correo electrónico es necesario para continuar'
      : this.usr.controls.email.hasError('email')
        ? 'Correo inválido'
        : '';
  }

  save()
   {
    this.sending = true;
    const data = this.usr.value;
    console.log(data);


    const id = this.data.id_cliente  !== '' && this.data.id_cliente  != null && this.data.id_cliente  != undefined ? `id: ${this.data.id_cliente},` : ' ';

    const name = data.name  !== '' && data.name  != null ? `name: "${data.name}",` : 'name: ".",';
    const tipo_documento = data.tipo_documento  !== '' && data.tipo_documento  != null ? `tipo_documento: "${data.tipo_documento}",` : 'tipo_documento: ".",';
    const contacto = data.contacto  !== '' && data.contacto  != null ? `contacto: "${data.contacto}",` : 'contacto: ".",';
    const telefono_empresa = data.telefono_empresa  !== '' && data.telefono_empresa  != null ? `telefono_empresa: "${data.telefono_empresa}",` : 'telefono_empresa: ".",';
    const telefono_contacto = data.telefono_contacto  !== '' && data.telefono_contacto  != null ? `telefono_contacto: "${data.telefono_contacto}",` : 'telefono_contacto: ".",';
    const direccion = data.direccion  !== '' && data.direccion  != null ? `direccion: "${data.direccion}",` : 'direccion: ".",';
    const email = data.email  !== '' && data.email  != null ? `email: "${data.email}",` : 'email: ".",';
    const color = data.color  !== '' && data.color  != null ? `color: "${data.color}",` : 'color: ".",';


    


    const queryParams = `${id} ${name} ${telefono_empresa} ${telefono_contacto} ${direccion} ${email} ${color} ${tipo_documento} ${contacto}`;
    const queryProps = 'id, name,';

    this.apiService.createCliente(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

      //  this.close(data);
        this.close({ cliente: response.data.createCliente, created: data.create_user == true });
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
