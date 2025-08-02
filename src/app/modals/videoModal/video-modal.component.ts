import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-video-modal',
    templateUrl: './video-modal.component.html'
})
export class VideoModalComponent implements OnInit, OnDestroy {
    constructor(
        public dialogRef: MatDialogRef<VideoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
