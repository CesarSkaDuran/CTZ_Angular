import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { rejects } from 'assert';
import { ApiService } from 'src/app/core/api/api.service';
//import { resolve } from 'path';

@Component({
  selector: 'vex-subir-imagen-modal',
  templateUrl: './subir-imagen-modal.component.html',
  styleUrls: ['./subir-imagen-modal.component.scss']
})
export class SubirImagenModalComponent implements OnInit {
  img_previsualizada:any;
  archivo:any;
  sending = false;
  id_usuario = this.data.id_usuario;
  id_cliente = this.data.id_cliente;
  id_conductor = this.data.id_conductor;
  photo = this.data.photo;
  photo_link = this.data.photo_link;
  loading=false;

  constructor(private sanitizer:DomSanitizer, private apiService: ApiService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<SubirImagenModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  detectarCambio(event){
    const imagenRecibida= event.target.files[0];
    this.archivo= imagenRecibida;
    this.extraerBase64(imagenRecibida).then((imagen:any)=>{
      this.img_previsualizada = imagen.base;
    }
    );
    //console.log(event.target.files);
  }

  extraerBase64=async($event:any)=> new Promise((resolve, reject)=>{
    try{
      const unsafeImg= window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          blob:$event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error =>{
        resolve({
          blob:$event,
          image,
          base: null
        });
      };
      
    } catch(e){
      return null;
    }
  });

  subirImagen(){

    console.log("El id del conductor:");
    console.log(this.id_conductor);

    if(this.id_usuario){
      this.saveImagenUsuario(this.archivo, this.id_usuario);
    }

    if(this.id_cliente){
      this.saveImagenCliente(this.archivo, this.id_cliente);
    }

    if(this.id_conductor){
      this.saveImagenConductores(this.archivo, this.id_conductor);
    }
    
  }

  getNombreImagenPerfil(link){
    //return link.indexOf('profiles/')+9;
    const arrayLink = link.split('/');
    return arrayLink[arrayLink.length-1];
  }

  saveImagenUsuario(archivo, id)
   {
    this.sending = true;

    this.apiService.savePatientProfileImage(archivo, id).subscribe(
      (response: any) => {
        this.sending = false;

        this.close();

        this.snackBar.open('Imagen Guardada', null, {
          duration: 4000
        });

      },
      error => {
        this.sending = false;
        this.snackBar.open('Error', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  


  saveImagenCliente(archivo, id)
  {
   this.sending = true;

   this.apiService.saveClienteProfileImage(archivo, id).subscribe(
     (response: any) => {
       this.sending = false;

       this.close();

       this.snackBar.open('Imagen Guardada', null, {
         duration: 4000
       });

     },
     error => {
       this.sending = false;
       this.snackBar.open('Error', null, {
         duration: 4000
       });

       console.log(error);
     }
   );
 }





 
 saveImagenConductores(archivo, id)
 {
  this.sending = true;

  this.apiService.saveConductorProfileImage(archivo, id).subscribe(
    (response: any) => {
      this.sending = false;

      this.close();

      this.snackBar.open('Imagen Guardada', null, {
        duration: 4000
      });

    },
    error => {
      this.sending = false;
      this.snackBar.open('Error', null, {
        duration: 4000
      });

      console.log(error);
    }
  );
}




  
saveUsuario(img) {
  this.loading = true;
  //const data = this.usuarioFormGroup.value;

  const id = `id:${this.id_usuario},`;
  console.log("este es el id de usuario:");
  console.log(this.id_usuario);
  console.log("este es la nueva imagen:");
  console.log(img);
  const photo = `photo:"${img}"`;

  const queryParams = `${id} ${photo}`;
  const queryProps ='id';


  if(img){
    this.apiService.saveUser(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;
        this.apiService.setRecord(response.data.saveRecord);
  
  
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

}


close() {
  this.dialogRef.close();
}


  ngOnInit(): void {
  }

}
