import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';

@Component({
  selector: 'vex-estado-pagos-modal',
  templateUrl: './estado-pagos-modal.component.html',
  styleUrls: ['./estado-pagos-modal.component.scss']
})
export class EstadoPagosModalComponent implements OnInit {
  sending = false;



  usr = new FormGroup({
    estado: new FormControl('', [])
});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService,private _snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<EstadoPagosModalComponent>,) { }

  close() {
    this.dialogRef.close();
  }
  
  saveCredito() {
    this.sending = true;
    const data = this.usr.value;
    const estado = `estado: ${data.estado}`;

    const queryParams = `id:${this.data.id_credito},${estado}`;
    const queryProps = 'id';

    this.apiService.saveCredito(queryParams, queryProps).subscribe(
        (response: any) => {
            this.sending = false;

            this.apiService.setRecord(response.data.saveRecord);


            this.close();

            this._snackBar.open('Guardado', null, {
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

  ngOnInit(): void {
  }

}
