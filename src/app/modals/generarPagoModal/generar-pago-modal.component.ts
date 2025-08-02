import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { CoreService } from 'src/app/core/core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'vex-generar-pago-modal',
  templateUrl: './generar-pago-modal.component.html',
  styleUrls: ['./generar-pago-modal.component.scss']
})
export class GenerarPagoModalComponent implements OnInit {

  loadingRecords=false;
  dataBancos: any []=[];
  dataCredito: any []=[];
  dataDetallePago: any []=[];
  dia_actual:string;
  sending = false;
  sumatoria_pagos = 0;
  sumatoria_actualizada = 0;
  valor_credito:any;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService,private _snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<GenerarPagoModalComponent>,
  private coreService: CoreService, private router: Router) { }

  clienteFormGroup = new FormGroup({
    valor: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    observacion: new FormControl('', []),
    modo_pago: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required])
  });

  ngOnInit(){
    this.dia_actual = moment().format('YYYY-MM-DD');

    this.loadBancos();
    this.dataBancos;

    this.loadDetallePago();
    this.dataDetallePago;

  }

  userPermisoStatus() {
    return this.coreService.currentUser.name;
  }


  loadBancos(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `todo:1`;
    const queryProps =
        'id, nombre';
    this.apiService.getBanco(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataBancos = response.data.banco;
            console.log(response.data);
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


  loadCredito(){
    console.log('loading records...');
    this.loadingRecords = true;

    console.log("id del credito desde el modal");
    console.log(this.data.id_credito);
    const queryParams = `id:${this.data.id_credito}`;
    const queryProps =
        'id, valor, abonos, estado, appointment{name, date, status}';
    this.apiService.getCredito(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataCredito = response.data.credito;

            console.log("Dat-credito:");
            console.log(response.data.credito);
            
            this.valor_credito;
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

  loadDetallePago(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `credito_id:${this.data.id_credito}`;
    const queryProps =
        'id, valor, credito{valor}';
    this.apiService.getDetallePago(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataDetallePago = response.data.detallePago;

            console.log("El detalle de pago es:");
            console.log(response.data);

            this.valor_credito = response.data.detallePago[0].credito.valor;

            this.sumatoria(response.data.detallePago);


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


  sumatoria(lista){
    var sumatoria = 0;
    for (let element of lista ) {
      var valor = parseInt(element.valor);
      sumatoria = sumatoria + valor;
    }

    this.sumatoria_pagos = sumatoria;
  }


  saveDetallePago() {
    this.sending = true;
    const data = this.clienteFormGroup.value;
    console.log("La data");
    console.log(data);
    const id_credito = `credito_id: ${this.data.id_credito},`;
    //const id_banco = `banco_id: ${data.modo_pago},`;
    const modo_pago = `modo_pago: "${data.modo_pago}",`;
    const valor = `valor: "${data.valor}",`;
    const fecha = `fecha: "${moment().format('YYYY-MM-DD')}",`;
    const observacion = `observacion: "${data.observacion}",`;
    const recibido_por = `recibido_por: "${this.userPermisoStatus()}",`;


    console.log("*********************************Estos son los parametros del query:");
    console.log(`${valor}${fecha}${modo_pago}${observacion}${recibido_por}${id_credito}`);

    const queryParams = `${valor}${fecha}${modo_pago}${observacion}${recibido_por}${id_credito}`;
    const queryProps = 'id';

    this.apiService.saveDetallePago(queryParams, queryProps).subscribe(
        (response: any) => {
            this.sending = false;

            this.apiService.setRecord(response.data.saveRecord);

            console.log("El data valor es:");
            console.log(data.valor);

            //this.saveCredito(data.valor, response.data.saveDetallePago.id);
            this.dialogRef.close();

            this._snackBar.open('Guardado', null, {
              duration: 4000
            });
        },
        error => {
            this.sending = false;
            this._snackBar.open(error, null, {
                duration: 4000
            });

            console.log(error);
        }
    );
  }



  pagoPdf(id) {
    this.router.navigate(['/app/pagofactura', id]);
    this.close();
  }


  /*
  saveCredito(valor_actual, id_pago) {
    this.sending = true;
    const abonos = `abonos: "${this.sumatoria_pagos+parseInt(valor_actual)}",`;
    this.sumatoria_actualizada=this.sumatoria_pagos+parseInt(valor_actual);

    console.log("el resultado de la resta es:");
    console.log(this.sumatoria_actualizada);
    console.log("+");
    console.log(this.valor_credito);
    console.log(this.sumatoria_actualizada-this.valor_credito);

    const estado = this.sumatoria_actualizada>=this.valor_credito ? `estado: 2,`:`estado: 1,`;

    const ultimo_pago = `ultimo_pago: "${moment().format('YYYY-MM-DD')}",`;

    const queryParams = `id:${this.data.id_credito}, ${estado} ${abonos} ${ultimo_pago}`;
    const queryProps = 'id';

    this.apiService.saveCredito(queryParams, queryProps).subscribe(
        (response: any) => {
            this.sending = false;

            this.apiService.setRecord(response.data.saveRecord);
            console.log(this.sumatoria_pagos);

            this._snackBar.open('Guardado', null, {
              duration: 4000
            });

            this.pagoPdf(id_pago);
        },
        error => {
            this.sending = false;
            this._snackBar.open('Error.', null, {
                duration: 4000
            });

            console.log(error);
        }
    );
  }*/

}
