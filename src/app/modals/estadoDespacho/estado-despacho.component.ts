import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';

@Component({
  selector: 'vex-estado-despacho',
  templateUrl: './estado-despacho.component.html',
  styleUrls: ['./estado-despacho.component.scss']
})
export class EstadoDespachoComponent implements OnInit {
  sending = false;
  estadoFormGroup = new FormGroup({
    estado: new FormControl('', [])
  });


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<EstadoDespachoComponent>) {}

  
  

    
  save(){
    this.sending = true;
    const data = this.estadoFormGroup.value;

    console.log(data);
    const status = `status: ${data.estado},`;

    const queryParams = `id:${this.data.id_appointment}, ${status}`;
    const queryProps = 'id';

    this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
        (response: any) => {
            this.sending = false;

            console.log("Guardado");
            console.log(response.data.createAppointmentCtz.id);

            this.close();

            this._snackBar.open('Guardado', null, {
                duration: 4000
            });
        },
        error => {
            this.sending = false;
            this._snackBar.open('Error', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
  }


  close() {
    this.dialogRef.close();
  }



  ngOnInit(): void {
    this.estadoFormGroup.patchValue({estado: this.data.estado_despacho});
  }

}

