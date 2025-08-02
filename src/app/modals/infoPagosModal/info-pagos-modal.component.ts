import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import pdf from '@iconify/icons-fa-solid/file-pdf';
import { Router } from '@angular/router';

@Component({
  selector: 'vex-info-pagos-modal',
  templateUrl: './info-pagos-modal.component.html',
  styleUrls: ['./info-pagos-modal.component.scss']
})
export class InfoPagosModalComponent implements OnInit {
  loadingRecords=false;
  dataDetallePago: any []=[];
  displayedColumns: string[] = ['id','fecha','valor','acciones'];
  pdf=pdf;
  total_Abonos: any;
  valor_credito: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService,private _snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<InfoPagosModalComponent>,private router: Router) { }

  
  loadDetallePago(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `credito_id:${this.data.id_credito}`;
    const queryProps =
        'id, valor, fecha, credito{id, abonos, valor}';
    this.apiService.getDetallePago(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataDetallePago = response.data.detallePago;

            this.total_Abonos=response.data.detallePago[0].credito.abonos;
            this.valor_credito=response.data.detallePago[0].credito.valor;

            console.log("El detalle de pago es:");
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

  public transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
  }

  close() {
    this.dialogRef.close();
  }

  
  pagoPdf(id) {
    this.router.navigate(['/app/pagofactura', id]);
    this.close();
  }

  ngOnInit(): void {
    this.loadDetallePago();
    this.dataDetallePago;
  }

}
