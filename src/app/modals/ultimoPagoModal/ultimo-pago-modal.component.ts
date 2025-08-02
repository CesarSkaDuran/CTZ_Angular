import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';

@Component({
  selector: 'vex-ultimo-pago-modal',
  templateUrl: './ultimo-pago-modal.component.html',
  styleUrls: ['./ultimo-pago-modal.component.scss']
})
export class UltimoPagoModalComponent implements OnInit {
  displayedColumns: string[] = ['fecha','valor'];
  dataPago: any []=[];
  loadingRecords = false;
  loading = false;
  fecha:string;
  valor:string;


  constructor(private apiService: ApiService,@Inject(MAT_DIALOG_DATA) public data: any,
  private _snackBar: MatSnackBar) {}

  
loadPago(){
  console.log('loading records...');
  this.loadingRecords = true;

  const queryParams = `credito_id:${this.data.id_credito}`;
  const queryProps =
      'id, fecha, valor';
  this.apiService.getDetallePago(queryParams, queryProps).subscribe(
      (response: any) => {
          this.dataPago = response.data.detallePago;
          this.fecha = response.data.detallePago[0].fecha;
          this.valor = response.data.detallePago[0].valor;
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
    this.loadPago();
    this.dataPago;
  }

}
