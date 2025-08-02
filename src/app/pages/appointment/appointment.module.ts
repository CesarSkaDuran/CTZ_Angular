import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentComponent } from './appointment.component';
// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@visurel/iconify-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [AppointmentComponent],
  imports: [
    CommonModule,
    // TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FullCalendarModule,
    // MaterialModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    IconModule,
    PageLayoutModule,
    AppointmentRoutingModule
  ],
  providers: []
})
export class AppointmentModule {}
