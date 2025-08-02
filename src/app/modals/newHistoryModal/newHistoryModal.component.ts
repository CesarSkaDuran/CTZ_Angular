import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject, of } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil, switchMap } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import roundHighlightOff from '@iconify/icons-ic/round-highlight-off';
moment.locale('es');



@Component({
    selector: 'app-newHistoryModal',
    templateUrl: './newHistoryModal.component.html'
})
export class NewHistoryModalComponent implements OnInit, AfterViewInit, OnDestroy {
    isNew = true;
    userData: any = [];
    protected patients: any[] = [];
    sending = false;
    selected: any = null;
    showOnlyName = false;
    model: any [] = [];
    msg: String ="";
    tableData: any[] = [];
    roundHighlightOff = roundHighlightOff;
    loading = false;
    dataNewPropect: any[] = [];
    items: any[] = [];
   
    @ViewChild(MatPaginator) paginator: MatPaginator;
    protected _onDestroy = new Subject<void>();

    constructor(
        
        public dialogRef: MatDialogRef<NewHistoryModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        
    ) 
    {
        // this.currentPatient = this.apiService.currentPatient;
    }

    loadRecords() {
        this.tableData.push(this.data.user);
    }
    
    ngOnInit() {
        this.loadRecords();
         
      //  this.getNewPropect();
    }


    ngAfterViewInit() { }

 
    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    addEmployee(): void {
        this.dataNewPropect.push(this.model);
        this.msg = 'campo agregado';
    }
  
}

