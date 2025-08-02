import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/api/api.service';
import { CoreService } from 'src/app/core/core.service';
import { EstadoDespachoComponent } from 'src/app/modals/estadoDespacho/estado-despacho.component';
import { Appointment } from 'src/app/models/appointment';


@Component({
  selector: 'vex-despachos',
  templateUrl: './despachos.component.html',
  styleUrls: ['./despachos.component.scss']
})
export class DespachosComponent implements OnInit {
  displayedColumns: string[] = ['id_pedido','cliente','fecha_despacho', 'ultimo_pago','hora_despacho', 'hora_llegada','valor', 'estado', 'acciones'];
  loadingRecords = false;
  limit = 10;
  offset = 0;
  id_conductor:any;
  data: Appointment[] = [];
  resultsLength = 0;
  resultsLength1 = 0;
  dataSource: MatTableDataSource<Appointment> | null;
  dataPagination: any[] = [];
  dataConductor: any[] = [];
  sending = false;
  public keyUp = new Subject<any>();
  nombre_conductor:any;
  id_usuario:any;

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar,public dialog: MatDialog,
    private coreService: CoreService) { }

  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
  });


  estadoDespachoModal(id_appointment = null, estado_despacho = null){
    const dialogRef = this.dialog.open(EstadoDespachoComponent, {
      width: '500px',
      height: '300px',
      maxHeight: '700px',
      data:{
        id_appointment : id_appointment,
        estado_despacho : estado_despacho
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadAppointmentPaginator();
      this.dataSource = new MatTableDataSource();
    });
  }


    nombreConductor() {
      return this.coreService.currentUser.conductor.name;
    }
    
    rolUsuario() {
        return this.coreService.currentUser.role.id;
      }

    ocultarTablas() {
        if(this.rolUsuario()==7){
            console.log("Index en el cliente de array");
            console.log(this.displayedColumns.findIndex( cols => cols == 'cliente'));
            this.displayedColumns.splice(this.displayedColumns.findIndex( cols => cols == 'cliente'), 1);
        }
    }
  
  userNombreRoleId() {
      console.log("actual user:");
      console.log(this.coreService.currentUser.id);
      
      this.id_usuario;
        this.loadConductores(this.id_usuario);
    }


  loadAppointmentPaginator() {
    this.loadingRecords = true;
    const date =`date: "${moment().format('YYYY-MM-DD')}",`;
    const date2 =`date2: "${moment().format('YYYY-MM-DD')}",`;
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const aprobado = `aprobado: 2`;

    var conductor = ' ';

    console.log("Este es el rol de usuario:");
    console.log(this.rolUsuario());

    if(this.rolUsuario()==7){
        conductor = this.nombreConductor() !== '' && this.nombreConductor() != null && this.nombreConductor() != undefined ? `conductor: "${this.nombreConductor()}",` : 'conductor: ".",';
    }
    

    const queryParams = `limit: ${this.limit}, ${conductor} offset: ${this.offset},${date} ${date2} ${searchText} ${aprobado}`;

    console.log("Este es el queryparams:");
    console.log(queryParams);

    

    const queryProps =
        'data{id, name, company, estado_despacho, hora_llegada, hora_despacho, hora_descargue, hora_fin, observaciones, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, patient{ id, name, color  }, doctor{ id, name, } }, total';

    console.log("------------------------------------Queryprops-------------------------------------");
    console.log(queryProps);

    this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
        (response: any) => {
            this.data = response.data.appointmentsPagination.data;
            this.resultsLength = response.data.appointmentsPagination.total;
            this.dataSource.data = this.data;
            this.loadingRecords = false;
            this.dataPagination = this.data;
            console.log(this.data);

        },
        error => {
            console.log("EL ERROR ESTUVO ACÁ 2");
            this.loadingRecords = false;
            this._snackBar.open('Error.', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
}


loadAppointmentPaginator2() {
    this.loadingRecords = true;
    const date =`date: "${moment().format('YYYY-MM-DD')}",`;
    const date2 =`date2: "${moment().format('YYYY-MM-DD')}",`;
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const aprobado = `aprobado: 2`;

    const queryParams = `limit: ${this.limit}, offset: ${this.offset},${date} ${date2} ${searchText} ${aprobado}`;
    const queryProps =
        'data{id, name, company, estado_despacho, hora_llegada, hora_despacho, hora_descargue, hora_fin, observaciones, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, patient{ id, name, color  }, doctor{ id, name, } }, total';

    this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
        (response: any) => {
            this.data = response.data.appointmentsPagination.data;
            this.resultsLength = response.data.appointmentsPagination.total;
            this.dataSource.data = this.data;
            this.loadingRecords = false;
            this.dataPagination = this.data;
            console.log(this.data);

        },
        error => {
            console.log("EL ERROR ESTUVO ACÁ 2");
            this.loadingRecords = false;
            this._snackBar.open('Error.', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
}

loadConductores(userid) {
    console.log('Cargando conductores');

    this.loadingRecords = true;

    const queryParams = `user_id:${userid}`;
    const queryProps =
        'id, photo, user_id, name, placa, email, telefono, cedula, created_at ';

    this.apiService.getConductor(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataConductor = response.data.conductor;

            this.nombre_conductor = response.data.conductor[0]?response.data.conductor[0].name:null;

            this.loadAppointmentPaginator();
            this.dataSource = new MatTableDataSource();
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


setHora(id=null, hora=null){
  this.sending = true;
  const hora_despacho = hora==1? `hora_despacho: "${moment().format('hh:mm a')}",`:' ';
  const hora_llegada = hora==2? `hora_llegada: "${moment().format('hh:mm a')}",`:' ';
  const hora_descargue = hora==3? `hora_descargue: "${moment().format('hh:mm a')}",`:' ';
  //const hora_fin = hora==4? `hora_fin: "${moment().format('hh:mm a')}",`:' ';

  const queryParams = `id:${id}, ${hora_despacho} ${hora_llegada} ${hora_descargue}`;
  const queryProps = 'id';

  this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
      (response: any) => {
          this.sending = false;

          this.loadAppointmentPaginator();
          this.dataSource = new MatTableDataSource();

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

searchKeyUp($event: KeyboardEvent): void {
    console.log("Evento captado");
    console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
        this.filters.controls.search.setValue('');
        return;
    }
    this.keyUp.next($event);

    this.loadAppointmentPaginator();
    this.dataSource = new MatTableDataSource();
}

    
saveFinalizado(id_pedido=null){
  this.sending = true;

  const status = `status: 6,`;//Estado finalizado

  const queryParams = `id:${id_pedido}, ${status}`;
  const queryProps = 'id';

  this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
      (response: any) => {
          this.sending = false;

          console.log("Guardado");
          console.log(response.data.createAppointmentCtz.id);

          this.loadAppointmentPaginator();
          this.dataSource = new MatTableDataSource();


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


saveHoraInicio(id=null){
  this.sending = true;
  const hora_llegada = `hora_llegada: "${moment().format('HH:MM')}",`;

  const queryParams = `id:${id}, ${hora_llegada}`;
  const queryProps = 'id';

  this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
      (response: any) => {
          this.sending = false;

          this.loadAppointmentPaginator();
          this.dataSource = new MatTableDataSource();

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



saveHoraFin(id=null){
  this.sending = true;
  const hora_fin = `hora_fin: "${moment().format('hh:mm a')}",`;

  const queryParams = `id:${id}, ${hora_fin}`;
  const queryProps = 'id';

  this.apiService.createAppointmentCtz(queryParams, queryProps).subscribe(
      (response: any) => {
          this.sending = false;

          this.saveFinalizado(id);

          

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


dateChange(event: any) {
    console.log("datechange");
    this.loadAppointmentPaginator();
    this.dataSource = new MatTableDataSource();
}


  ngOnInit(): void {
    console.log("Este es el momento:");
    console.log(moment().format('YYYY-MM-DD'));

    this.ocultarTablas();

    this.id_usuario=this.coreService.currentUser.id;

    this.userNombreRoleId();
  }

}
