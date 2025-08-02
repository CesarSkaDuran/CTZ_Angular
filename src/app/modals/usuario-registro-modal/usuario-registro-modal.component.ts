import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import { RegistrarUsuarioModalComponent } from '../registrarUsuarioModal/registrar-usuario-modal.component';


@Component({
  selector: 'vex-usuario-registro-modal',
  templateUrl: './usuario-registro-modal.component.html',
  styleUrls: ['./usuario-registro-modal.component.scss']
})
export class UsuarioRegistroModalComponent implements OnInit {


  loading = false;

 

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RegistrarUsuarioModalComponent>
    ) { }

  usuarioFormGroup = new FormGroup({
    name: new FormControl('', []),
    email: new FormControl('', []),
    role_id: new FormControl('', []),
    password: new FormControl('', []),
    user_type: new FormControl('', [])
});



  
saveUsuario() {
  this.loading = true;
  const data = this.usuarioFormGroup.value;

  const name = data.name  !== '' && data.name  != null ? `name: "${data.name}",` : 'name: ".",';
  const email  = data.email  !== '' && data.email  != null ? `email: "${data.email}",` : 'email: ".",';
  const role_id  = data.role_id  !== '' && data.role_id  != null ? `role_id: ${data.role_id },` : 'role_id: ".",';
  const password   = data.password   !== '' && data.password   != null ? `password: "${data.password}",` : 'password: ".",';


  const queryParams = `${name} ${email} ${role_id} ${password} user_type:1`;
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



close() {
  this.dialogRef.close();
}




  ngOnInit(): void {
  }

}
