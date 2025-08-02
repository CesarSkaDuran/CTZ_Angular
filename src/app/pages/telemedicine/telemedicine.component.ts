import { Component, OnInit } from '@angular/core';
import icMore from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove from '@iconify/icons-ic/cancel';
import icCamera from '@iconify/icons-ic/videocam';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NgxAgoraService, AgoraClient, ClientEvent, Stream, StreamEvent } from 'ngx-agora';
import icClose from '@iconify/icons-ic/close';

@Component({
    selector: 'app-telemedicine',
    templateUrl: './telemedicine.component.html',
    styleUrls: ['./telemedicine.component.scss'],
    animations: [
        stagger80ms,
        scaleIn400ms,
        fadeInRight400ms,
        fadeInUp400ms
    ]
})
export class TelemedicineComponent implements OnInit {
    displayedColumns: string[] = ['status', 'patient', 'phone', 'date', 'time', 'service', 'doctor', 'options'];
    data: any[] = [];

    searchText = '';
    loadingRecords = false;
    totalIncome: 0;

    icMore = icMore;
    icEdit = icEdit;
    icRemove = icRemove;
    icCamera = icCamera;
    icClose = icClose;

    alertIsVisible = true;

    patientsModalIsOpen = false;

    resultsLength = 0;
    pageSize = 500;
    pageSizeOptions: number[] = [500, 1000, 2500, 5000];
    orderBy = 'created_at';
    order = 'desc';
    limit = 500;
    offset = 0;

    localCallId = 'clinicalsoftware';
    title = 'angular-video-call';
    remoteCalls: string[] = [];

    private client: AgoraClient;
    private localStream: Stream;
    private uid: number;

    // shortcuts: ShortcutInput[] = [];

    constructor(
        public dialog: MatDialog,
        private ngxAgoraService: NgxAgoraService
    ) {
        this.uid = Math.floor(Math.random() * 100);
    }

    ngOnInit() {
        this.loadRecords();
        this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
        this.assignClientHandlers();

        // Added in this step to initialize the local A/V stream
        this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
        this.assignLocalStreamHandlers();
    }

    /**
     * Attempts to connect to an online chat room where users can host and receive A/V streams.
     */
    join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
        this.client.join(null, 'clinicalsoftware', this.uid, onSuccess, onFailure);
    }

    /**
     * Attempts to upload the created local A/V stream to a joined chat room.
     */
    publish(): void {
        this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
    }

    private assignLocalStreamHandlers(): void {
        this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
            console.log('accessAllowed');
        });

        // The user has denied access to the camera and mic.
        this.localStream.on(StreamEvent.MediaAccessDenied, () => {
            console.log('accessDenied');
        });
    }

    private initLocalStream(onSuccess?: () => any): void {
        this.localStream.init(
            () => {
                // The user has granted access to the camera and mic.
                this.localStream.play(this.localCallId);
                if (onSuccess) {
                    onSuccess();
                }
            },
            err => console.error('getUserMedia failed', err)
        );
    }

    dateChange(event: any) {
        this.loadRecords();
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;

        // this.loadRecords();
    }

    loadRecords() {
        this.data = [
            // {
            //     id: 1,
            //     status: 'AGENDADO',
            //     date: '2020-07-20',
            //     time: '10:00 AM',
            //     patient: 'Demo user',
            //     phone: '+57 554 5544547',
            //     service: 'Servicio de prueba',
            //     doctor: 'Demo doctor'
            // }
        ];
    }

    pageChange(event: PageEvent) {
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadRecords();
    }

    startCall() {
        this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
    }

    private assignClientHandlers(): void {
        this.client.on(ClientEvent.LocalStreamPublished, evt => {
            console.log('Publish local stream successfully');
        });

        this.client.on(ClientEvent.Error, error => {
            console.log('Got error msg:', error.reason);
            if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
                this.client.renewChannelKey(
                    '',
                    () => console.log('Renewed the channel key successfully.'),
                    renewError => console.error('Renew channel key failed: ', renewError)
                );
            }
        });

        this.client.on(ClientEvent.RemoteStreamAdded, evt => {
            const stream = evt.stream as Stream;
            this.client.subscribe(stream, { audio: true, video: true }, err => {
                console.log('Subscribe stream failed', err);
            });
        });

        this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
            const stream = evt.stream as Stream;
            const id = this.getRemoteId(stream);
            if (!this.remoteCalls.length) {
                this.remoteCalls.push(id);
                setTimeout(() => stream.play(id), 1000);
            }
        });

        this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
            const stream = evt.stream as Stream;
            if (stream) {
                stream.stop();
                this.remoteCalls = [];
                console.log(`Remote stream is removed ${stream.getId()}`);
            }
        });

        this.client.on(ClientEvent.PeerLeave, evt => {
            const stream = evt.stream as Stream;
            if (stream) {
                stream.stop();
                this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
                console.log(`${evt.uid} left from this channel`);
            }
        });
    }

    private getRemoteId(stream: Stream): string {
        return `agora_remote-${stream.getId()}`;
    }
}
