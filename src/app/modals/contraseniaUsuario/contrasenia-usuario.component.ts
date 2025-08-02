import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';

@Component({
  selector: 'vex-contrasenia-usuario',
  templateUrl: './contrasenia-usuario.component.html',
  styleUrls: ['./contrasenia-usuario.component.scss']
})
export class ContraseniaUsuarioComponent implements OnInit {

  id_usuario:any;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ContraseniaUsuarioComponent>,
    
  ) { }

  contraseniaFormGroup = new FormGroup({
    password: new FormControl('', [])
});


saveUser() {
  this.loading = true;
  const data = this.contraseniaFormGroup.value;

  const password   = data.password   !== '' && data.password   != null ? `password: "${data.password}",` : 'password: ".",';

  const queryParams = `id:${this.data.id}, ${password}`;
  const queryProps ='id';

  this.apiService.saveUser(queryParams, queryProps).subscribe(
    (response: any) => {
      this.loading = false;

      this.apiService.setRecord(response.data.saveRecord);

      console.log("Contraseña cambiada");
      console.log(response);

      this.close();

      this._snackBar.open('Contraseña guardada', null, {
        duration: 4000
      });
    },
    error => {
      this.loading = false;
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


  ngOnInit(): void {
  }

}
