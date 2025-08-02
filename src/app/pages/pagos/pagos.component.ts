/*import { Component, OnInit } from '@angular/core';*/

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
import { UltimoPagoModalComponent } from 'src/app/modals/ultimoPagoModal/ultimo-pago-modal.component';
import { InfoPagosModalComponent } from 'src/app/modals/infoPagosModal/info-pagos-modal.component';
import { EstadoPagosModalComponent } from 'src/app/modals/estadoPagosModal/estado-pagos-modal.component';
import { GenerarPagoModalComponent } from 'src/app/modals/generarPagoModal/generar-pago-modal.component';
import moment from 'moment';

@Component({
  selector: 'vex-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
]
})
export class PagosComponent implements OnInit {
  loadingRecords = false;
  loading = false;
  dataClientes: any []=[];
  displayedColumns: string[] = ['id_pedido','cliente','fecha_despacho', 'estado_pedido', 'valor', 'ultimo_pago','abonos', 'fecha_pago','estado','acciones'];
  public keyUp = new Subject<any>();
  plusCircle=plusCircle;
  eye=eye;
  baselineDeleteForever=baselineDeleteForever;
  message=message;
  roundsend=roundsend;
  refresh=refresh;
  baselineEditAttributes=baselineEditAttributes;
  edit=edit;
  dataCredito: any []=[];
  sending = false;

  ELEMENT_DATA = [
    {id_pedido: 1, cliente: 'Fernando Andrés', fecha_despacho: '30-09-2021', ultimo_pago: '12-10-2021', valor: '$40.000', abonos: '20-09-2021', estado: 'Entrega'},
    {id_pedido: 1, cliente: 'Diego A. Medina', fecha_despacho: '12-09-2021', ultimo_pago: '12-10-2021', valor: '$20.000', abonos: '01-09-2021', estado: 'Entrega'}
  ];

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

  }
  searchKeyUp($event: KeyboardEvent): void {
      console.log("Evento captado");
      console.log($event);
      if ($event.code === 'KeyN' && $event.shiftKey) {
          this.filters.controls.search.setValue('');
          return;
      }
      this.keyUp.next($event);

      this.loadCredito();
      this.dataCredito;
  }

  dateChange(event: any) {
      console.log("datechange");
      this.loadCredito();
      this.dataCredito;
  }

  editarClientesPermiso() {
      return this.coreService.currentUser.role.permiso.editar_clientes;
  }

  public transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
  }

  verClientesPermiso() {
    return this.coreService.currentUser.role.permiso.ver_clientes;
  }

  loadClientes() {
    console.log('loading clientes...');
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        
    let queryParams = `${this.filters.value.search?searchText:'search:""'}`;
    let queryProperties =
        'id, photo, name, email, tipo_documento, direccion, contacto, telefono_empresa, telefono_contacto, color';

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

loadCredito(){
  console.log('loading records...');
  this.loadingRecords = true;
  const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : 'search:""';
  const date =
  this.filters.value.date !== '' && this.filters.value.date !== null && this.filters.value.date2 !== undefined
      ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
      : `date: "${moment().format('YYYY-MM-DD')}",`;
  
  const date2 =
  this.filters.value.date2 !== '' && this.filters.value.date2 !== null && this.filters.value.date2 !== undefined
      ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
      : `date2: "${moment().format('YYYY-MM-DD')}",`;

  const aprobado = `aprobado: 2`;

  const queryParams = `${searchText} ${date} ${date2} ${aprobado}`;
  const queryProps =
      'id, valor, ultimo_pago, fecha_pago, abonos, estado, appointment{name, date, status, fecha_pago}';
  this.apiService.getCredito(queryParams, queryProps).subscribe(
      (response: any) => {
          this.dataCredito = response.data.credito;
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



ultimoPagoModal(id_credito=null) {
  const dialogRef = this.dialog.open(UltimoPagoModalComponent, {
    width: '400px',
    height: '300px',
    maxHeight: '800px',
    data:{
      id_credito:id_credito
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;
  });
}


detallePagos(id_credito=null) {


  const dialogRef = this.dialog.open(InfoPagosModalComponent, {
    width: '600px',
    height: '600px',
    maxHeight: '800px',
    data:{
      id_credito:id_credito
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;
  });
}



estadoPagos(id_credito=null) {
  const dialogRef = this.dialog.open(EstadoPagosModalComponent, {
    width: '600px',
    height: '600px',
    maxHeight: '800px',
    data:{
      id_credito:id_credito
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;

    this.loadCredito();
    this.dataCredito;
  });
}


pagosModal(id_credito=null) {
  console.log("El id del crédito es:");
  console.log(id_credito);
  const dialogRef = this.dialog.open(GenerarPagoModalComponent, {
    width: '500px',
    height: '600px',
    maxHeight: '700px',
      data: {
        id_credito:id_credito
      }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.loadClientes();
    this.dataClientes;

    this.loadCredito();
    this.dataCredito;
  });
}



actualizarCreditos() {
  this.sending = true;

  const queryParams = `actualizar:1`;
  const queryProps ='id';


  this.apiService.saveCredito(queryParams, queryProps).subscribe(
    (response: any) => {
      this.sending = false;
      this.apiService.setRecord(response.data.saveRecord);

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

    this.actualizarCreditos();

    this.loadClientes();
    this.dataClientes;

    this.loadCredito();
    this.dataCredito;
  }
}
