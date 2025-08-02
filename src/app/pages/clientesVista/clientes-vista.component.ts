import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import plusCircle from '@iconify/icons-feather/plus-circle';
import eye from '@iconify/icons-fa-solid/eye';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';
import message from '@iconify/icons-ic/message';
import roundsend from '@iconify/icons-ic/round-send';
import refresh from '@iconify/icons-ic/refresh';
import baselineEditAttributes from '@iconify/icons-feather/edit';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarClienteModalComponent } from 'src/app/modals/registrarClienteModal/registrar-cliente-modal.component';
import edit from '@iconify/icons-fa-solid/pen-square';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { CoreService } from 'src/app/core/core.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { DetalleUsuariosComponent } from '../detalleUsuarios/detalle-usuarios.component';
import { UserAddModalComponent } from 'src/app/modals/userAddModal/user-add-modal.component';

 

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'vex-clientes-vista',
  templateUrl: './clientes-vista.component.html',
  styleUrls: ['./clientes-vista.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
]
})
export class ClientesVistaComponent implements OnInit {
  loadingRecords = false;
  loading = false;
  dataClientes: any []=[];
  displayedColumns: string[] = ['id', 'user_id','name','tipo_documento','direccion','telefono_contacto','acciones'];
  public keyUp = new Subject<any>();
  plusCircle=plusCircle;
  eye=eye;
  baselineDeleteForever=baselineDeleteForever;
  message=message;
  roundsend=roundsend;
  refresh=refresh;
  baselineEditAttributes=baselineEditAttributes;
  edit=edit;

  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
  });



  @ViewChild('search', { static: false }) searchEl: ElementRef;

  constructor(
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private coreService: CoreService,
    private snackBar: MatSnackBar,
    )
    {
      const codeSearchSubscription = this.keyUp
      .pipe(
          map((event: any) => event.target.value),
          debounceTime(300),
          distinctUntilChanged(),
          flatMap(search => of(search).pipe(delay(300)))
      )
      .subscribe(result => {
          this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
          this.loadClientes();
          this.dataClientes;
      });
    }


    
  sortRecords(event: MatSort): void {
      //this.orderBy = event.active;
      //this.order = event.direction;
      this.loadClientes();
      this.dataClientes;
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
      this.loadClientes();
      this.dataClientes;
  }

  editarClientesPermiso() {
      return this.coreService.currentUser.role.permiso.editar_clientes;
  }

  verClientesPermiso() {
    return this.coreService.currentUser.role.permiso.ver_clientes;
  }

  loadClientes() {
    console.log('loading clientes...');
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    let queryParams = `${this.filters.value.search?searchText:'search:""'}`;
    let queryProperties =
        'id, user_id, photo, name, email, tipo_documento, direccion, contacto, telefono_empresa, telefono_contacto, color';

    this.apiService.getClientes(queryParams, queryProperties).subscribe(
        (response: any) => {
            console.log(response);
            this.dataClientes = response.data.cliente;


        },

        error => {
            console.log(error);
        }
    );
}



saveUsuario(id_cliente, nom, em) {
  this.loading = true;

  const bloqueado = `bloqueado: ${1},`;
  const name = nom  !== '' && nom  != null ? `name: "${nom}",` : 'name: ".",';
  const email  = em  !== '' && em  != null ? `email: "${em}",` : 'email: ".",';
  const cliente  = id_cliente  !== '' && id_cliente  != null ? `cliente_id: ${id_cliente},` : 'cliente_id: ".",';

  const queryParams = `${cliente} ${name} ${bloqueado} ${email}`;
  const queryProps ='id';


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




saveCliente(id_cliente, user_id) {

  const user = `user_id: ${user_id}`;

  const queryParams = `id:${id_cliente}, ${user}`;
  const queryProps = 'id, name';

  console.log("Query params cliente:");
  console.log(queryParams);

  this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
      (response: any) => {



          this.snackBar.open('Cliente editado', null, {
              duration: 4000
          });
      },
      error => {
          this.snackBar.open('Error cliente', null, {
              duration: 4000
          });
          console.log(error);
      }
  );
}



detalleUsuarioModal(id_cliente, photo_cliente, name) {
  const dialogRef = this.dialog.open(DetalleUsuariosComponent, {
    width: '800px',
    height: '400px',
    maxHeight: '800px',
    data:{
      id_usuario:null,
      cliente_id:id_cliente,
      photo:photo_cliente,
      nombre:name
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;
  });
}


/*
crearClienteModal() {
  const dialogRef = this.dialog.open(UserAddModalComponent, {
      width: '700px',
      height: 'auto'
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;
  });
}*/

/*
editarClienteModal(id_cliente) {
  const dialogRef = this.dialog.open(EditarClienteModalComponent, {
      width: '450px',
      height: 'auto',
      data: {
        id: id_cliente
      }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;
  });
}*/



registrarCliente(id_cliente=null) {
  const dialogRef = this.dialog.open(UserAddModalComponent, {
    width: '500px',
    height: '600px',
    maxHeight: '700px',
      data: {
        id_cliente: id_cliente
      }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;
  });
}



delete(cli: any) {

  const r = confirm('¿Desea eliminar el cliente?');
  if (r === true) {
      this.loadingRecords = true;

      const id = cli ? `id: ${cli.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id, ';

      this.apiService.createCliente(queryParams, queryProps).subscribe(
          (response: any) => {
              this.loadingRecords = false;

              this.loadClientes();
              this.dataClientes;

              this._snackBar.open('Eliminado', null, {
                  duration: 4000
              });
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
}




  ngOnInit(): void {
    this.loadClientes();
    this.dataClientes;
  }

}

