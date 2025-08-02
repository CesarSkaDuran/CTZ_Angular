import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TranslateModule } from '@ngx-translate/core';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

//import { AntecedentesComponent } from './antecedentes.component';
//import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Routes, RouterModule } from '@angular/router';
import { IconModule } from '@visurel/iconify-angular';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { ProductosComponent } from './productos.component';
import { ProductosRoutingModule } from './producto-routing.module';


@NgModule({
    declarations: [ProductosComponent],
    imports: [
        CommonModule,
        // TranslateModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        SecondaryToolbarModule,
        MatIconModule,
        MatPaginatorModule,
        MatTabsModule,
        MatSortModule,
        MatCheckboxModule,
        IconModule,
        PageLayoutModule,
        ProductosRoutingModule,
        MatTableModule,
        MatInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatMenuModule



    ],
    providers: []
})
export class ProductosModule { }
