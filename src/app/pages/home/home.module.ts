import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { IconModule } from '@visurel/iconify-angular';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        // TranslateModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        IconModule,
        PageLayoutModule,
        SecondaryToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatButtonModule,
        MatMenuModule,
        // KeyboardShortcutsModule.forRoot(),
        HomeRoutingModule,
        NgxChartsModule
    ],
    providers: [
    ]
})
export class HomeModule { }
