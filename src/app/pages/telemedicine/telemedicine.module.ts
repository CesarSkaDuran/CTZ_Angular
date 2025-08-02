import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelemedicineRoutingModule } from './telemedicine-routing.module';
import { TelemedicineComponent } from './telemedicine.component';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule } from '@angular/material-moment-adapter'

@NgModule({
    declarations: [TelemedicineComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
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
        TelemedicineRoutingModule
    ]
})
export class TelemedicineModule { }
