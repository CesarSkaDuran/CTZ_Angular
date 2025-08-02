import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import camera from '@iconify/icons-fa-solid/camera';
import { ApiService } from 'src/app/core/api/api.service';
import { SubirImagenModalComponent } from 'src/app/modals/subirImagenModal/subir-imagen-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vex-detalle-usuarios',
  templateUrl: './detalle-usuarios.component.html',
  styleUrls: ['./detalle-usuarios.component.scss']
})
export class DetalleUsuariosComponent implements OnInit {
  camera=camera;
  loadingRecords = false;
  dataUser: any []=[];
  user_photo:any;
  photo=this.data.photo;
  user_id=this.data.id_usuario;
  cliente_id=this.data.cliente_id;
  conductor_id=this.data.id_conductor;
  nombre=this.data.nombre;
  //user_id=this.data.id_usuario;
  path_usuarios = `${environment.serverUrl}/public/img/profiles/${this.photo}`;
  path_clientes = `${environment.serverUrl}/public/img/clientes/${this.photo}`;
  path_conductor = `${environment.serverUrl}/public/img/conductores/${this.photo}`;
  //path_usuarios = ''+this.photo;
  //path_clientes = 'http://apictz.yosoydigital.org/public/img/clientes/'+this.photo;
  //path_conductor = 'http://apictz.yosoydigital.org/public/img/conductores/'+this.photo;


  constructor(public dialog: MatDialog, private apiService: ApiService, private _snackBar: MatSnackBar,  public dialogRef: MatDialogRef<DetalleUsuariosComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


  loadUser(){
    console.log('loading records...');
    this.loadingRecords = true;

    const queryParams = `id:${this.user_id}`;
    const queryProps =
        'photo';
    this.apiService.getUser(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataUser = response.data.user;
            console.log("Esta es la foto que estamos leyendo:");
            this.photo = response.data.user.photo;
            this.path_usuarios;
            
            //this.user_photo = "https://conexion.trituradoselzulia.com/public/img/profiles/5xt7hi8QV2.jpg"+this.user_id ;
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



  close() {
    this.dialogRef.close();
  }



  subirImagen() {
    const dialogRef = this.dialog.open(SubirImagenModalComponent, {
        width: '450px',
        height: '600px',
        data:{
          id_usuario:this.user_id,
          id_cliente:this.cliente_id,
          id_conductor:this.conductor_id,
          photo:this.photo
        }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.close();
    });
  }

  ngOnInit(): void {
    console.log("Id del cliente:");
    console.log(this.cliente_id);
    console.log(this.path_clientes);
  }

}
