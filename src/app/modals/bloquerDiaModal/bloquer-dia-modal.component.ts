import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { CoreService } from 'src/app/core/core.service';

@Component({
  selector: 'vex-bloquer-dia-modal',
  templateUrl: './bloquer-dia-modal.component.html',
  styleUrls: ['./bloquer-dia-modal.component.scss']
})
export class BloquerDiaModalComponent implements OnInit {

  sending = false;
  dataBloqueo:any;
  loadingRecords = false;


  getuserName(){
    return this.coreService.currentUser.name;
  }

  getuserId(){
    return this.coreService.currentUser.id;
  }

  diaFiltros = new FormGroup({
    fecha: new FormControl('', []),
    hora_inicio: new FormControl('', []),
    hora_fin: new FormControl('', [])
  });

  constructor(private coreService: CoreService, private apiService: ApiService, private snackBar: MatSnackBar,public dialogRef: MatDialogRef<BloquerDiaModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadBloqueo();
    this.dataBloqueo;
  }

  save() {
    this.sending = true;
    const data = this.diaFiltros.value;

    //const id_usuario = data.servicios_cotizar !== '' && data.servicios_cotizar != null ? `servicios_cotizar: "${data.servicios_cotizar}",` : 'servicios_cotizar: ".",';
    const fecha = data.fecha !== '' && data.fecha != null ? `fecha: "${moment(data.fecha).format('YYYY-MM-DD')}",` : 'fecha: ".",';
    const hora_inicio = data.hora_inicio !== '' && data.hora_inicio != null ? `hora_inicio: "${data.hora_inicio}",` : 'hora_inicio: ".",';
    const hora_fin = data.hora_fin !== '' && data.hora_fin != null ? `hora_fin: "${data.hora_fin}",` : 'hora_fin: ".",';
    const nombreusuario = this.getuserName() !== '' && this.getuserName() != null ? `nombreusuario: "${this.getuserName()}",` : 'nombreusuario: ".",';
    const id_usuario = this.getuserId() != null ? `id_usuario: ${this.getuserId()},` : 'id_usuario: ".",';
    //const nombreusuario = data.servicios_cotizar !== '' && data.servicios_cotizar != null ? `servicios_cotizar: "${data.servicios_cotizar}",` : 'servicios_cotizar: ".",';
    console.log("Valor del formulario");
    console.log(data);


    
    const queryParams = `${fecha} ${nombreusuario} ${hora_inicio} ${hora_fin} ${id_usuario}`;
    const queryProps = 'id';

    this.apiService.saveBloqueo(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this.close();

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

      },
      (error: any) => {
        this.sending = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }



  borrarBloqueo(id) {
    this.sending = true;
    const data = this.diaFiltros.value;

    const queryParams = `id:${id}, delete: 1`;
    const queryProps = 'id';

    this.apiService.saveBloqueo(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this.loadBloqueo();
        this.dataBloqueo;

        this.close();

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

      },
      (error: any) => {
        this.sending = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }



  loadBloqueo(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `todo:1`;
    const queryProps =
        'id, id_usuario, fecha, nombreusuario';
    this.apiService.getBloqueo(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataBloqueo = response.data.bloqueo;
            console.log("Acá está:");
            console.log(response.data.bloqueo);
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



}
