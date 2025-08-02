import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icAcCircle from '@iconify/icons-feather/user';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-feather/file-plus';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icFace from '@iconify/icons-ic/twotone-face';
import icCalendar from '@iconify/icons-ic/twotone-restore';
import icNotification from '@iconify/icons-feather/bell';
import icHistory from '@iconify/icons-feather/plus-square';
import icAppointment from '@iconify/icons-ic/twotone-event-available';

import { NavigationService } from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { PopoverService } from '../../components/popover/popover.service';

import moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { RecordsService } from 'src/app/pages/records/records.service';
import { Router } from '@angular/router';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from 'src/app/models/appointment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreService } from 'src/app/core/core.service';

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  icBookmarks = icBookmarks;
  icMenu = icMenu;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;
  icAcCircle = icAcCircle;
  icFace = icFace;
  icCalendar = icCalendar;
  icNotification = icNotification;
  icHistory = icHistory;
  icAppointment = icAppointment;
  data: Appointment[] = [];
  time: string;
  ampm: string;
  date: any = moment();
  loadingRecords = false;
  resultsLength = 0;
  dataSource: MatTableDataSource<Appointment> | null;
  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private apiService: ApiService,
              private router: Router,
              private recordsService: RecordsService,
              private navigationService: NavigationService,
              private dialog: MatDialog,
              private popoverService: PopoverService,
              private _snackBar: MatSnackBar,
              private coreService: CoreService
              ) { }
              

  ngOnInit() {
    this.coreService.rol_actual$.subscribe(texto=>{
      console.log('hijo', texto);
    }
    );
  }

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  startTime = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    this.ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = this.checkTime(m);
    s = this.checkTime(s);
    this.time = h + ':' + m + ':' + s;

    const t = setTimeout(this.startTime, 500);
  }

  checkTime(i: any) {
    if (i < 10) { i = '0' + i };  // add zero in front of numbers < 10
    return i;
  }

  openAppointmentModal(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '680px',
      height: 'auto',
     // maxHeight: '850px',
      data: {
        appointment
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

    
      console.log(result);
    });
  }
        loadAppointmentPaginator() {
        this.loadingRecords = true;
      
      //  const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `limit: `;
        const queryProps =
            'data{ id, name, company, value, date, patient_id, time, end_time, tipo_descarga, observaciones, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, patient{ id, name, color  }, doctor{ id, name, } }, total';

        this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
            (response: any) => {
                this.data = response.data.appointmentsPagination.data;
           
                this.resultsLength = response.data.appointmentsPagination.total;
                this.dataSource.data = this.data;
                this.loadingRecords = false;
                console.log(this.data)

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
  selectCalendar() {

    this.router.navigate(['/app/appointment']);

  }
  selectRecord() {
    try {
      if (this.recordsService.getLastRecordFromCache()) {
        let record = this.recordsService.getLastRecordFromCache();
        this.recordsService.setRecord(record);
        this.router.navigate(['/app/records/view', record.identification]);
      }
    } catch (error) {
      console.log(error);
      alert('No se ha seleccionado un paciente recientemente');
    }
  }
}
