import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent } from './records.component';
// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { RecordsService } from './records.service';
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

@NgModule({
  declarations: [RecordsComponent],
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
    // KeyboardShortcutsModule.forRoot(),
    RecordsRoutingModule
  ],
  providers: [
    RecordsService,
  ]
})
export class RecordsModule {}
