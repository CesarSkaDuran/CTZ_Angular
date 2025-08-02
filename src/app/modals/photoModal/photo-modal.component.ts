import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import * as moment from 'moment';

import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { Patient } from 'src/app/models/patient';

moment.locale('es');

@Component({
    selector: 'app-photo-modal',
    templateUrl: './photo-modal.component.html'
})
export class PhotoModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    currentPatient: Patient = null;
    currentPatientPicture: string;
    public showWebcam = false;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
        width: {ideal: 400},
        height: {ideal: 400}
    };
    public errors: WebcamInitError[] = [];

    // latest snapshot
    public webcamImage: WebcamImage = null;

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();


    constructor(
        public dialogRef: MatDialogRef<PhotoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        WebcamUtil.getAvailableVideoInputs()
            .then((mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            });
        
            console.log(this.data);
        if (this.data.patient) {
            this.currentPatient = this.data.patient;
            this.currentPatientPicture = this.data.patient.profile_url
        }
    }

    ngAfterViewInit() { }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
    }

    // public showNextWebcam(directionOrDeviceId: boolean | string): void {
    //     // true => move forward through devices
    //     // false => move backwards through devices
    //     // string => move to device with given deviceId
    //     this.nextWebcam.next(directionOrDeviceId);
    // }

    public handleImage(webcamImage: WebcamImage): void {
        console.info('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
        this.currentPatientPicture = webcamImage.imageAsDataUrl;
        this.showWebcam = false;
    }

    public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }

    save() {
        this.sending = true;

        // this.urltoFile(this.webcamImage.imageAsDataUrl, 'image.jpg', 'image/jpeg').then(file => {
        //     this.apiService.savePatientProfileImage(file, this.currentPatient.id.toString()).subscribe(result => {
        //         console.log(result);
        //         this.close(this.currentPatientPicture);
        //         this.sending = false;
        //         this.snackBar.open('Guardado', null, {
        //             duration: 4000
        //         });
        //     }, error => {
        //         console.log(error);
        //         this.sending = false;
        //         this.snackBar.open('Error.', null, {
        //             duration: 4000
        //         });
        //     });
        // });
    }

    urltoFile(url: string, filename: string, mimeType: string) {
        return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
        );
    }

    ngOnDestroy(): void { }
}
