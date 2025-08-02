import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/api/api.service';
import print from '@iconify/icons-fa-solid/print';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'vex-pago-factura',
  templateUrl: './pago-factura.component.html',
  styleUrls: ['./pago-factura.component.scss']
})
export class PagoFacturaComponent implements OnInit {
  loadingRecords=false;
  dataDetallePago: any []=[];
  dataHistorialPago: any []=[];
  pago_id=this.route.snapshot.paramMap.get('id');
  id_pago:any;
  fecha_pago:string;
  valor_pago:any;
  banco_id_pago:any;
  nombre_cliente:string;
  valor_credito:number;
  total_abonos:number;
  recibido_por:string;
  credito_id:number;
  fecha_credito:string;
  nit_cliente:number;
  pedido_id:number;
  direccion_cliente:number;
  print=print;
  displayedColumns: string[] = ['id','valor','fecha'];
  observacion: any;
  isChecked=false;


  constructor(private apiService: ApiService, private _snackBar: MatSnackBar,private route: ActivatedRoute,private router: Router) { }

  encabezadoForm = new FormGroup({
    encabezado: new FormControl('', [Validators.required]),
  });

    
  loadDetallePago(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `id:${this.pago_id}`;
    const queryProps =
        'id, valor, credito_id, observacion, fecha, recibido_por, banco_id, credito{id, fecha, valor, abonos, appointment{id, name, patient{tipo_documento, direccion}}}';
    this.apiService.getDetallePago(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataDetallePago = response.data.detallePago;
            this.id_pago=response.data.detallePago[0].id;
            this.valor_pago=response.data.detallePago[0].valor;
            this.fecha_pago=response.data.detallePago[0].fecha;
            this.banco_id_pago=response.data.detallePago[0].banco_id;
            this.observacion=response.data.detallePago[0].observacion;
            this.nombre_cliente=response.data.detallePago[0].credito.appointment.name;
            this.pedido_id=response.data.detallePago[0].credito.appointment.id;
            this.fecha_credito=response.data.detallePago[0].credito.fecha;
            this.valor_credito=response.data.detallePago[0].credito.valor;
            this.total_abonos=response.data.detallePago[0].credito.abonos;
            this.recibido_por=response.data.detallePago[0].recibido_por;
            this.credito_id=response.data.detallePago[0].credito_id;
            this.nit_cliente=response.data.detallePago[0].credito.appointment.patient.tipo_documento;
            this.direccion_cliente=response.data.detallePago[0].credito.appointment.patient.direccion;
            console.log(response.data.detallePago);

            this.loadHistorialPago();
            this.dataHistorialPago;
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



  loadHistorialPago(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `noid:${this.pago_id}, credito_id2:${this.credito_id}`;
    const queryProps =
        'id, valor, credito_id, fecha, banco_id, credito{valor, appointment{id, name}}';
    this.apiService.getDetallePago(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataHistorialPago = response.data.detallePago;
            console.log(response.data.detallePago);
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


  imprimir(){
    window.print();
  }


  volverPagos() {
    this.router.navigate(['/app/pagos']);
  }

  
  public transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
  }

  checkValue(){
    this.isChecked = this.isChecked == true ?  this.isChecked=false : this.isChecked=true;

    return this.isChecked;
  }

  ngOnInit(): void {
    this.loadDetallePago();
    this.dataDetallePago;
  }

}
