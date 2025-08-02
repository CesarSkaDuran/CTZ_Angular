import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
// import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import * as moment from 'moment';

import icMore from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove from '@iconify/icons-ic/twotone-delete';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Record } from 'src/app/models/record';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import { CalendarOptions, EventApi, FullCalendarComponent } from '@fullcalendar/angular';
import { AppointmentVendedorComponent } from 'src/app/modals/appointmentVendedor/appointmentVendedor.component';
import { CoreService } from 'src/app/core/core.service';
import { AppointmentDetailComponent } from 'src/app/modals/appointmentDetail/appointmentDetail.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class AppointmentComponent implements OnInit, AfterViewInit {
  currentEvents: EventApi[] = [];
  rawEvents: any[] = [];

  searchText = '';
  loadingRecords = false;

  icMore = icMore;
  icEdit = icEdit;
  icRemove = icRemove;
  isClicked = false;

  patientsModalIsOpen = false;

  resultsLength = 0;

  calendarOptions: CalendarOptions = {
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    contentHeight: 'auto',
    nowIndicator: true,
    slotMinTime: '06:00:00',
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    eventOverlap: false,
    eventTimeFormat: {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    eventsSet: this.handleEvents.bind(this),
    dateClick: this.dateClick.bind(this),
    eventClick: this.eventClick.bind(this)
  }

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  usuario: any;
  role: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private coreService: CoreService,
  ) {
    var usuarioJSON = localStorage.getItem('current_user');
    var usuario = JSON.parse(usuarioJSON);
    this.usuario = usuario
    this.role = this.usuario.role.role; 
  }

  ngOnInit() {

    this.loadPedidos();


    //this.loadRecords();
  }

  ngAfterViewInit() {
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  dateClick(event) {
    if (this.isClicked) {
      this.openAppointmentDetail({date: event.date});
      this.isClicked = false;
    } else {
      this.isClicked = true;
    }
    setTimeout(() => {
      this.isClicked = false;
    }, 250);
  }

  eventClick(event) {
    let match = this.rawEvents.filter((item) => {
      return item.id == event.event.id;
    });

    console.log(match);

    if (match.length > 0) {
      this.openAppointmentDetail(match[0]);
    }

  }


  loadPedidos(){
    //const queryParams = `fecha:"${moment('2022-08-07').format('YYYY-MM-DD')}",fecha2:"${moment('2022-09-07').format('YYYY-MM-DD')}"`;
    const queryParams = `search:""`;
    const queryProps = 'id,date,time,end_time,name,value,status,metros,direccion,observaciones,type_concreto,vendedor,conductor,tipo_descarga,status,fecha_pago,coordenadas, imagen';

    this.apiService.getPedido(queryParams, queryProps).subscribe(
      (response: any) => {


        

        let responseData = response.data.pedido.map((appointment) => {

          return {
            id: appointment.id,
            date: moment(appointment.date + ' ' + appointment.time).format('YYYY-MM-DDTHH:mm'),
            end: appointment.end_time != null ? moment(appointment.date + ' ' + appointment.end_time).format('YYYY-MM-DDTHH:mm') : null,
            title: appointment.name,
            value: appointment.value,
            status: appointment.status?appointment.status:0,
            backgroundColor: this.statusColor(appointment.status?appointment.status:'9575CD'),
            eventDisplay: 'block'
          };
        });

        this.rawEvents = response.data.pedido;
        this.calendarOptions.events = responseData;
      },
      error => {
        this._snackBar.open('Error', null, {
          duration: 4000
        });
      }
    );
  }




  /*
  loadRecords() {
    this.loadingRecords = true;
    const queryParams = `search:""`;
    const queryProps =
      'id, name, fecha_pago, company, value, date, patient_id, time, end_time, tipo_descarga, observaciones, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, patient{ id, name, color  }, doctor{ id, name, }';

    this.apiService.getAppointments(queryParams, queryProps).subscribe(
      (response: any) => {
        let responseData = response.data.appointments.map((appointment) => {

          return {
            id: appointment.id,
            date: moment(appointment.date + ' ' + appointment.time).format('YYYY-MM-DDTHH:mm'),
            end: appointment.end_time != null ? moment(appointment.date + ' ' + appointment.end_time).format('YYYY-MM-DDTHH:mm') : null,
            title: appointment.name,
            value: appointment.value,
            status: appointment.status?appointment.status:0,
            backgroundColor: this.statusColor(appointment.status?appointment.status:'9575CD'),
            eventDisplay: 'block'
          };
        });

        this.rawEvents = response.data.appointments;
        this.currentEvents = responseData;
        this.calendarOptions.events = responseData;
      },
      error => {
        this.loadingRecords = false;
        this._snackBar.open('Error.', null, {
          duration: 4000
        });
      }
    );
  }
  */

  userPermisoCrear() {
    return this.coreService.currentUser.role.permiso.crear_pedido;
  }

  getRoleId() {
    return this.coreService.currentUser.role.id;
  }

  userPermisoStatus() {
    return this.coreService.currentUser.role.permiso.status;
  }
  openAppointmentVendedor(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentVendedorComponent, {
      width: '680px',
      height: 'auto',
      //maxHeight: '850px',
      data: {
        appointment
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      this.loadPedidos();
      //this.loadRecords();
    });
  }
  openAppointmentDetail(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentDetailComponent, {
      width: '680px',
      height: 'auto',
      data: {
        appointment
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      this.loadPedidos();
      //this.loadRecords();
    });
  }
  openAppointmentModal(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '680px',
      height: 'auto',
      //maxHeight: '850px',
      data: {
        appointment 
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      //this.loadRecords();
      this.loadPedidos();
      //console.log(result);
    });
  }

  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

  replaceSpace(str: string) {
    return str.replace(/<br>/g, '\n');
  }

  statusColor(status: number) {
    switch (status) {
      case 1:
        return '#1562c7';
      case 2:
        return '#e48a04';
      case 3:
        return '#81D4FA';
      case 4:
        return '#c41515';
      case 6:
        return '#1bdd1b';
      default:
        break;
    }
  }

  delete(appointment: any) {

    const r = confirm('¿Eliminar Ingreso?');
    if (r === true) {
      this.loadingRecords = true;

      const id = appointment ? `id: ${appointment.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id, name, company, date, value, time';

      this.apiService.saveAppointment(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          //this.loadRecords();

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loadingRecords = false;
          this._snackBar.open('Error.', null, {
            duration: 4000
          });

          //console.log(error);
        }
      );
    }
  }
}
