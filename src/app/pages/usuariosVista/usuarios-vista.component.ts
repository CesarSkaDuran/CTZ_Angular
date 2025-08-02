import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import edit from '@iconify/icons-fa-solid/pen-square';
import eye from '@iconify/icons-fa-solid/eye';
import cam from '@iconify/icons-fa-solid/camera';
//import { EditarUsuarioComponent } from 'src/app/modals/editarUsuario/editar-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import plusCircle from '@iconify/icons-feather/plus-circle';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';
//import { CrearUsuarioComponent } from 'src/app/modals/crearUsuario/crear-usuario.component';
//import { DisclaimerModalComponent } from 'src/app/modals/disclaimerModal/disclaimer-modal.component';
import { CoreService } from 'src/app/core/core.service';
import { RegistrarUsuarioModalComponent } from 'src/app/modals/registrarUsuarioModal/registrar-usuario-modal.component';
import { MatSort } from '@angular/material/sort';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DetalleUsuariosComponent } from '../detalleUsuarios/detalle-usuarios.component';

@Component({
  selector: 'vex-usuarios-vista',
  templateUrl: './usuarios-vista.component.html',
  styleUrls: ['./usuarios-vista.component.scss'],
  animations: [
      stagger80ms,
      scaleIn400ms,
      fadeInRight400ms,
      fadeInUp400ms
  ]
})
export class UsuariosVistaComponent implements OnInit {
  displayedColumns: string[] = ['id','nombre', 'email' , 'bloqueo', 'role', 'acciones'];//,'email', 'role_id', 'acciones'
  loadingRecords = false;
  loading = false;
  dataUser: any []=[];
  edit=edit;
  eye=eye;
  plusCircle=plusCircle;
  baselineDeleteForever=baselineDeleteForever;
  cam=cam;
  public keyUp = new Subject<any>();
  @ViewChild('search', { static: false }) searchEl: ElementRef;

  filters = new FormGroup({
    search: new FormControl('', [])
  });

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar,public dialog: MatDialog,private coreService: CoreService,private router: Router) {
    const codeSearchSubscription = this.keyUp
    .pipe(
        map((event: any) => event.target.value),
        debounceTime(300),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(300)))
    )
    .subscribe(result => {
        this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
        this.loadUser();
        this.dataUser;
    });
  }


  
  editarUsuariosPermiso() {
    return this.coreService.currentUser.role.permiso.editar_usuarios;
  }

  verUsuariosPermiso() {
    return this.coreService.currentUser.role.permiso.ver_usuarios;
  }


  verDetalle(id) {
    this.router.navigate(['/app/detalleusuario', id]);
  }

  
  loadUser(){
    console.log('loading records...');
    this.loadingRecords = true;
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `${this.filters.value.search?searchText:'search:""'}`;
    const queryProps =
        'id, conductor{id} photo, name, bloqueado, email, role_id, role{role, permiso{status}}';
    this.apiService.getUser(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataUser = response.data.user;
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


registrarUsuarioModal(id_usuario = null) {
  const dialogRef = this.dialog.open(RegistrarUsuarioModalComponent, {
    width: '800px',
    height: '400px',
    maxHeight: '800px',
    data:{
      id_usuario:id_usuario
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
      this.loadUser();
      this.dataUser;
  });
}


detalleUsuarioModal(id_usuario, photo_usuario, name) {
  const dialogRef = this.dialog.open(DetalleUsuariosComponent, {
    width: '800px',
    height: '400px',
    maxHeight: '800px',
    data:{
      id_usuario:id_usuario,
      id_cliente:null,
      photo:photo_usuario,
      nombre:name
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
      this.loadUser();
      this.dataUser;
  });
}

borrarUser(id) {

  const r = confirm('¿Eliminar Ingreso?');

  if (r === true) {
    

    this.loading = true;

    const queryParams = `id:${id}, delete:1`;
    const queryProps ='id';

    this.apiService.saveUser(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.apiService.setRecord(response.data.saveRecord);

        this.loadUser();
        this.dataUser;


        this._snackBar.open('Eliminado', null, {
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

}


getRoleId(){
  return this.coreService.currentUser.role_id;
}

getNombreRol(rol){
  switch(rol){
        case 1:
          return "Superadmin";
          break;
        case 2:
          return "Admin";
          break;
        case 3:
          return "Ingresos";
          break;
  }
}




      
sortRecords(event: MatSort): void {
  //this.orderBy = event.active;
  //this.order = event.direction;
  this.loadUser();
  this.dataUser;
}

pageChange(event: PageEvent) {
  //this.limit = event.pageSize;
  //this.offset = event.pageSize * event.pageIndex;
  //this.loadClientes();
  //this.dataClientes;
}
searchKeyUp($event: KeyboardEvent): void {
  console.log("Evento captado");
  console.log($event);
  if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
  }
  this.keyUp.next($event);
}

dateChange(event: any) {
  this.loadUser();
  this.dataUser;
}




  ngOnInit(): void {
    this.loadUser();
    this.dataUser;
  }

}
