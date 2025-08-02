import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
// import { MaterialModule } from '@app/material.module';
import { IconModule } from '@visurel/iconify-angular';
import { RecordsService } from '../records/records.service';
import { LightboxModule } from 'ngx-lightbox';
import { PrintRecordComponent } from './print-record.component';
import { PrintRecordsRoutingModule } from './print-record-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    PrintRecordComponent,
  ],
  imports: [
    CommonModule,
    // TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    // MaterialModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    IconModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    LightboxModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    // KeyboardShortcutsModule.forRoot(),
    PrintRecordsRoutingModule
  ],
  providers: [
    RecordsService,
  ]
})
export class PrintRecordModule {}
