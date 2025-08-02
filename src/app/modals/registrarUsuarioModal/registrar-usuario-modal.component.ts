import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import { ContraseniaUsuarioComponent } from '../contraseniaUsuario/contrasenia-usuario.component';
//import { RegistrarUsuarioModalComponent } from '../registrarUsuarioModal/registrar-usuario-modal.component';
import edit from '@iconify/icons-fa-solid/pen-square';

@Component({
  selector: 'vex-registrar-usuario-modal',
  templateUrl: './registrar-usuario-modal.component.html',
  styleUrls: ['./registrar-usuario-modal.component.scss']
})
export class RegistrarUsuarioModalComponent implements OnInit {
  loading = false;
  id_usuario=this.data.id_usuario;
  dataUser: any []=[];
  dataRole: any []=[];
  loadingRecords = false;
  name:any;
  email:any;
  role_id:any;
  edit=edit;
  conductor_id: any;
  bloqueado: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RegistrarUsuarioModalComponent>,
    public dialog: MatDialog
    ) { }

  usuarioFormGroup = new FormGroup({
    name: new FormControl('', []),
    email: new FormControl('', []),
    role_id: new FormControl('', []),
    password: new FormControl('', []),
    user_type: new FormControl('', []),
    bloqueado: new FormControl('', [])
});

saveUsuario() {
  this.loading = true;
  const data = this.usuarioFormGroup.value;

  const id = `id:${this.id_usuario}`;
  const bloqueado = data.bloqueado  !== '' && data.bloqueado  != null ? `bloqueado: ${data.bloqueado},` : 'bloqueado: ".",';
  const name = data.name  !== '' && data.name  != null ? `name: "${data.name}",` : 'name: ".",';
  const email  = data.email  !== '' && data.email  != null ? `email: "${data.email}",` : 'email: ".",';
  const role_id  = data.role_id  !== '' && data.role_id  != null ? `role_id: ${data.role_id},` : 'role_id: ".",';
  const password   = data.password   !== '' && data.password   != null ? `password: "${data.password}",` : 'password: ".",';

  const queryParams = `${id? id : " "} ${name} ${bloqueado} ${email} ${this.id_usuario ? " " : role_id} ${this.id_usuario==null? password : " "} user_type:1`;
  const queryProps ='id';


  this.apiService.saveUser(queryParams, queryProps).subscribe(
    (response: any) => {
      this.loading = false;
      this.apiService.setRecord(response.data.saveRecord);
      this.close();
      this.snackBar.open('Guardado', null, {
        duration: 4000
      });
    },
    error => {
      this.loading = false;
      this.snackBar.open('Error.', null, {
        duration: 4000
      });

      console.log(error);
    }
  );
}


loadUser(){
  console.log('loading records...');
  this.loadingRecords = true;
  const queryParams = `id:${this.id_usuario}`;
  const queryProps =
      'id, name, email, bloqueado, role_id, conductor{id}';
  this.apiService.getUser(queryParams, queryProps).subscribe(
      (response: any) => {
          this.dataUser = response.data.user;

          this.name=response.data.user[0].name;
          this.email=response.data.user[0].email;
          this.role_id=response.data.user[0].role_id;
          this.conductor_id=response.data.user[0].user_id;
          this.bloqueado=response.data.user[0].bloqueado;
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


loadRole(){
  console.log('loading records...');
  this.loadingRecords = true;
  const queryParams = `search:""`;
  const queryProps =
      'id, role';
  this.apiService.getRole(queryParams, queryProps).subscribe(
      (response: any) => {
          this.dataRole = response.data.role;
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



crearContrasenia() {
  const dialogRef = this.dialog.open(ContraseniaUsuarioComponent, {
    width: '800px',
    height: '400px',
    maxHeight: '800px',
    data:{
      id:this.id_usuario
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
  });
}





close() {
  this.dialogRef.close();
}

  ngOnInit(): void {
    if(this.id_usuario!=null){
      this.loadUser();
      this.dataUser;
    }

    this.loadRole();
    this.dataRole;
  }

}
