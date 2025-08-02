import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-registrar-cliente-modal',
  templateUrl: './registrar-cliente-modal.component.html',
  styleUrls: ['./registrar-cliente-modal.component.scss']
})
export class RegistrarClienteModalComponent implements OnInit {

  loadingRecords = false;
  sending = false;
  selected: any = null;
  showOnlyName = false;
  editing = false;
  dataClientes: any []=[];
  nombre:any;
  tipo_documento:any;
  direccion:any;
  telefono_empresa:any;
  telefono_contacto:any;
  email:any;
  cliente_color:any;
  id_cliente=this.data.id_cliente;
  

  protected color: any[] = [];

  public patientFilterCtrl: FormControl = new FormControl();

  public filteredcolor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RegistrarClienteModalComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  clienteFormGroup = new FormGroup({
    
    id: new FormControl('', []),
    name: new FormControl('', [Validators.required]),
    tipo_documento: new FormControl('', [Validators.required]),
    telefono_empresa	: new FormControl('', [Validators.required]),
    telefono_contacto: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    email: new FormControl('', [ Validators.email]),
    color: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  saveUsuario() {
    this.sending = true;
    const data = this.clienteFormGroup.value;
  
    const id = `id:${this.id_cliente}`;
    const name = data.name  !== '' && data.name  != null ? `name: "${data.name}",` : 'name: ".",';
    const email  = data.email  !== '' && data.email  != null ? `email: "${data.email}",` : 'email: ".",';
    const tipo_documento  = data.tipo_documento  !== '' && data.tipo_documento  != null ? `tipo_documento: "${data.tipo_documento}",` : 'tipo_documento: ".",';
    const direccion  = data.direccion  !== '' && data.direccion  != null ? `direccion: "${data.direccion}",` : 'direccion: ".",';
    const telefono_empresa  = data.telefono_empresa  !== '' && data.telefono_empresa  != null ? `telefono_empresa: ${data.telefono_empresa},` : 'telefono_empresa: ".",';
    //const password   = data.password   !== '' && data.password   != null ? `password: "${data.password}",` : 'password: ".",';
  
    const queryParams = `${id? id : " "} ${telefono_empresa} ${name} ${email} ${tipo_documento} ${direccion} user_type:1`;
    const queryProps ='id';
  
  
    this.apiService.saveUser(queryParams, queryProps).subscribe(
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
        this.snackBar.open('Error.', null, {
          duration: 4000
        });
  
        console.log(error);
      }
    );
  }


  insertarCliente()
   {
    this.sending = true;
    const data = this.clienteFormGroup.value;
    console.log(data);

    const id = `id: ${this.id_cliente},`;
    const name = data.name !== '' && data.name != null ? `name: "${data.name}",` : 'name: ".",';
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento != null ? `tipo_documento: "${data.tipo_documento}",` : 'tipo_documento: ".",';
    const contacto = data.contacto !== '' && data.contacto != null ? `contacto: "${data.contacto}",` : 'contacto: ".",';
    const telefono_empresa = data.telefono_empresa !== '' && data.telefono_empresa != null ? `telefono_empresa: "${data.telefono_empresa}",` : 'telefono_empresa: ".",';
    const telefono_contacto = data.telefono_contacto !== '' && data.telefono_contacto != null ? `telefono_contacto: "${data.telefono_contacto}",`: 'telefono_contacto: ".",';
    const direccion = data.direccion !== '' && data.direccion != null ? `direccion: "${data.direccion}",`: 'direccion: ".",';
    const email = data.email !== '' && data.email != null ? `email: "${data.email}",`: 'email: ".",';
    const color = data.color !== '' && data.color != null ? `color: "${data.color}",`: 'color: ".",';
    const password = data.password !== '' && data.password != null ? `password: "${data.password}",`: 'password: ".",';


    const queryParams = `${id != null ? id : " "} ${password} ${name} ${telefono_empresa} ${telefono_contacto} ${direccion} ${email} ${color} ${tipo_documento} ${contacto}`;
    const queryProps = 'id, name,';

    this.apiService.createCliente(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;


        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close();


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



  loadClientes() {
    console.log('loading clientes...');

    let queryParams = `id:${this.id_cliente}`;
    let queryProperties =
        'id, name, email, tipo_documento, direccion, contacto, telefono_empresa, telefono_contacto, color';

    this.apiService.getClientes(queryParams, queryProperties).subscribe(
        (response: any) => {
            console.log(response);
            this.dataClientes = response.data.cliente;
            this.nombre=response.data.cliente[0].name;
            this.tipo_documento=response.data.cliente[0].tipo_documento;
            this.direccion=response.data.cliente[0].direccion;
            this.telefono_empresa=response.data.cliente[0].telefono_empresa;
            this.telefono_contacto=response.data.cliente[0].telefono_contacto;
            this.email=response.data.cliente[0].email;
            this.cliente_color=response.data.cliente[0].color;
        },

        error => {
            console.log(error);
        }
    );
}


  ngOnInit(): void {

    /*
    this.loadColor();

    this.patientFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtercolor();
      });
    */

    if(this.id_cliente!=null){
      this.loadClientes();
      this.dataClientes;
    }else{
      console.log("No hay id de cliente");
    }

  }
  

  /*
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
*/



/*
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
*/


/*

  getErrorMessage() {
    return this.clienteFormGroup.controls.email.hasError('required')
      ? 'El correo electrónico es necesario para continuar'
      : this.clienteFormGroup.controls.email.hasError('email')
        ? 'Correo inválido'
        : '';
  }

*/



  close() {
    this.dialogRef.close();
  }


}

