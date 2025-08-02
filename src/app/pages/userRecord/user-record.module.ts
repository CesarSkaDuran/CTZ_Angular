import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
// import { MaterialModule } from '@app/material.module';
import { IconModule } from '@visurel/iconify-angular';
import { UserRecordComponent } from './user-record.component';
import { UserRecordsRoutingModule } from './user-record-routing.module';
import { RecordsService } from '../records/records.service';
import { LightboxModule } from 'ngx-lightbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from "ng2-file-upload";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TextFieldModule } from '@angular/cdk/text-field';
import { GHistoryComponent } from 'src/app/modules/gynecology/g_history/g-history.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    UserRecordComponent,
    GHistoryComponent
  ],
  imports: [
    CommonModule,
    // TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    // MaterialModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    IconModule,
    PageLayoutModule,
    FileUploadModule,
    SecondaryToolbarModule,
    LightboxModule,

    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    TextFieldModule,
    MatSidenavModule,
    // KeyboardShortcutsModule.forRoot(),
    UserRecordsRoutingModule
  ],
  providers: [
    RecordsService,
  ]
})
export class UserRecordModule {}
