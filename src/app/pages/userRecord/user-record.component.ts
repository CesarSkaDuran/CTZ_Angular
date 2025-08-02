import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { RecordsService } from '../records/records.service';

import { Lightbox } from 'ngx-lightbox';

import icDelete from '@iconify/icons-ic/twotone-delete';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDone from '@iconify/icons-ic/twotone-done';
import icBlock from '@iconify/icons-ic/twotone-block';
import icRemove from '@iconify/icons-ic/twotone-remove';

import icHistory from '@iconify/icons-feather/file-text';
import icPhysic from '@iconify/icons-feather/eye';
import icConclusion from '@iconify/icons-feather/life-buoy';
import icEvolution from '@iconify/icons-feather/trending-up';
import icMultimedia from '@iconify/icons-feather/image';
import icPopq from '@iconify/icons-feather/share-2';
import icControl from '@iconify/icons-feather/heart';
import icInfo from '@iconify/icons-feather/book-open';
import icPatient from '@iconify/icons-feather/users';
import icPrint from '@iconify/icons-ic/twotone-print';

import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialog } from '@angular/material/dialog';
import { CredentialsService } from 'src/app/core';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PregnanciesModalComponent } from 'src/app/modals/pregnanciesModal/pregnancies-modal.component';
import { CitologiesModalComponent } from 'src/app/modals/citologiesModal/citologies-modal.component';
import { CoombsModalComponent } from 'src/app/modals/coombsModal/coombs-modal.component';
import { htoModalComponent } from 'src/app/modals/htoModal/hto-modal.component';
import { HbModalComponent } from 'src/app/modals/hbModal/hb-modal.component';
import { CitModalComponent } from 'src/app/modals/citModal/cit-modal.component';
import { VaccinesModalComponent } from 'src/app/modals/vaccinesModal/vaccines-modal.component';
import { ObsModalComponent } from 'src/app/modals/obsModal/obs-modal.component';
import { EvolutionModalComponent } from 'src/app/modals/evolutionModal/evolution-modal.component';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ControlModalComponent } from 'src/app/modals/controlModal/control-modal.component';
import { MultimediaModalComponent } from 'src/app/modals/multimediaModal/multimedia-modal.component';
import { Patient } from 'src/app/models/patient';
import { PatientFormModalComponent } from 'src/app/modals/patientFormModal/patient-form-modal.component';
import { PhotoModalComponent } from 'src/app/modals/photoModal/photo-modal.component';

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class UserRecordComponent implements OnInit {
  displayedControlColumns: string[] = ['week', 'weight', 'ta', 'pam', 'au', 'pression', 'fcf', 'edema', 'options'];
  controlsData: any[] = [];

  icDelete = icDelete;
  icEdit = icEdit;
  icDone = icDone;
  icBlock = icBlock;
  icRemove = icRemove;

  icHistory = icHistory;
  icPhysic = icPhysic;
  icConclusion = icConclusion;
  icEvolution = icEvolution;
  icMultimedia = icMultimedia;
  icPopq = icPopq;
  icControl = icControl;
  icInfo = icInfo;
  icPatient = icPatient;
  icPrint = icPrint;

  searchText = '';
  resultsLength = 0;
  loadingControls = false;
  currentRecord: any = null;
  currentPatient: Patient;
  loading = false;

  uploadForm: FormGroup;

  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: 'http://localhost/hc_server/public/v1/actions/recordMultimedia'
  });

  details = new FormGroup({
    id: new FormControl('', []),
    motive: new FormControl('', [Validators.required]),
    menarche: new FormControl('', []),
    cycles: new FormControl('', []),
    record_fur: new FormControl('', []),
    record_g: new FormControl('', []),
    record_p: new FormControl('', []),
    record_v: new FormControl('', []),
    record_a: new FormControl('', []),
    record_pp: new FormControl('', []),
    record_up: new FormControl('', []),
    record_fpp: new FormControl('', []),
    record_prs: new FormControl('', []),
    amenorrhea: new FormControl('', []),
    amenorrhea_text: new FormControl('', []),
  });

  physical = new FormGroup({
    id: new FormControl('', []),
    physical_ta: new FormControl('', [Validators.required]),
    physical_fc: new FormControl('', []),
    weight: new FormControl('', []),
    height: new FormControl('', []),
    head: new FormControl('', []),
    neck: new FormControl('', []),
    thorax: new FormControl('', []),
    pregnancy: new FormControl('', []),
    exams: new FormControl('', [])
  });

  laboratory = new FormGroup({
    id: new FormControl('', []),
    patient_group: new FormControl('', []),
    patient_rh: new FormControl('', []),
    partner_group: new FormControl('', []),
    partner_rh: new FormControl('', [])
  });

  birth = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', []),
    time: new FormControl('', []),
    type: new FormControl('', []),
    episiotomy: new FormControl('', []),
    alum: new FormControl('', []),
    blood_loss: new FormControl('', []),
    oxytocic: new FormControl('', []),
    anesthesia: new FormControl('', []),
    sex: new FormControl('', []),
    weight: new FormControl('', []),
    height: new FormControl('', []),
    size: new FormControl('', []),
    observations: new FormControl('', [])
  });

  labor = new FormGroup({
    id: new FormControl('', []),
    date: new FormControl('', []),
    time: new FormControl('', []),
    labor_ta: new FormControl('', []),
    labor_fcf: new FormControl('', []),
    membranes: new FormControl('', []),
    presentation: new FormControl('', []),
    observations: new FormControl('', [])
  });

  conclusion = new FormGroup({
    id: new FormControl('', []),
    surgical: new FormControl('', []),
    pathological: new FormControl('', []),
    notes: new FormControl('', []),
    diagnosis: new FormControl('', []),
    tests: new FormControl('', []),
    behavior: new FormControl('', []),
    process: new FormControl('', [])
  });

  evolution = new FormGroup({
    id: new FormControl('', []),
    details: new FormControl('', [])
  });

  popq = new FormGroup({
    id: new FormControl('', []),
    popq_Aa: new FormControl('', []),
    popq_Ba: new FormControl('', []),
    popq_C: new FormControl('', []),
    popq_gh: new FormControl('', []),
    popq_pb: new FormControl('', []),
    popq_tvl: new FormControl('', []),
    popq_Ap: new FormControl('', []),
    popq_Bp: new FormControl('', []),
    popq_D: new FormControl('', [])
  });

  orderBy = 'created_at';
  order = 'asc';
  limit = 50;
  offset = 0;

  // shortcuts: ShortcutInput[] = [];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private credentialsService: CredentialsService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private _lightbox: Lightbox,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    // set cached record if exist

    this.setRecordFromCache();

    let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('recordId'))));

    record$.subscribe(recordId => {
      this.getRecord(recordId);
      // this.getRecordMultimedia(recordId);

      this.uploader.setOptions({
        additionalParameter: {
          record_id: recordId
        },
        headers: [
          {
            name: 'authorization',
            value: `Bearer ${this.credentialsService.credentials.access_token}`
          }
        ]
      });
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia(this.currentRecord.identification) };

    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });
    // this.openPregnanciesModal();
  }

  setRecordFromCache() {
    let currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }

  setCurrentRecord(record: any) {
    this.currentRecord = record;
    this.loadControls();

    if (record.details) {
      this.details.setValue({
        id: record.details.id,
        motive: record.details.motive ? record.details.motive.replace(/<br>/g, '\n') : '',
        menarche: record.details.menarche,
        cycles: record.details.cycles,
        record_fur: record.details.record_fur,
        record_g: record.details.record_g,
        record_p: record.details.record_p,
        record_v: record.details.record_v,
        record_a: record.details.record_a,
        record_pp: record.details.record_pp,
        record_up: record.details.record_up,
        record_fpp: record.details.record_fpp,
        record_prs: record.details.record_prs,
        amenorrhea: record.details.amenorrhea,
        amenorrhea_text: ''
      });

      if (record.details.record_fur) {
        this.setAmenhorrea(record.details.record_fur);
      }
      // this.details.setValue(record.details);
      // this.details.controls.record_fur.setValue(moment(record.details.record_fur).toISOString());
    }

    if (record.patient) {
      this.currentPatient = record.patient;
    }



    if (record.evolution) {
      this.evolution.setValue({
        id: record.evolution.id,
        details: record.evolution.details.replace(/<br>/g, '\n')
      });
    }

    if (record.laboratory) {
      this.laboratory.setValue(record.laboratory);
    }

    if (record.birth) {
      this.birth.setValue(record.birth);
    }

    if (record.labor) {
      this.labor.setValue(record.labor);
    }

    if (record.popq) {
      this.popq.setValue(record.popq);
    }

    if (record.conclusion) {
      this.conclusion.setValue({
        id: record.id,
        surgical: record.conclusion.surgical ? record.conclusion.surgical.replace(/<br>/g, '\n') : '',
        pathological: record.conclusion.pathological ? record.conclusion.pathological.replace(/<br>/g, '\n') : '',
        notes: record.conclusion.notes ? record.conclusion.notes.replace(/<br>/g, '\n') : '',
        diagnosis: record.conclusion.diagnosis ? record.conclusion.diagnosis.replace(/<br>/g, '\n') : '',
        tests: record.conclusion.tests ? record.conclusion.tests.replace(/<br>/g, '\n') : '',
        behavior: record.conclusion.behavior ? record.conclusion.behavior.replace(/<br>/g, '\n') : '',
        process: record.conclusion.process ? record.conclusion.process.replace(/<br>/g, '\n') : ''
      });
    }
  }

  getRecord(id: any) {
    this.loading = true;
    const queryParams = `id: "${id}"`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id,identification, popq{id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D}, patient{id, name, identification, civil_status, position, birth_date, phone, address, company, email, partner_name, partner_profession, profile_url}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process}, multimedias{id,name,description,url,type,status,created_at}, created_at';

    this.apiService.getRecord(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        this.apiService.setRecord(result.data.record);
        this.setCurrentRecord(result.data.record);

        this.getRecordMultimedia(id);

        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  getRecordMultimedia(id: any) {
    this.loading = true;
    const queryParams = `record_id: "${id}"`;
    const queryProps =
      'id,name,description,url,type,status,created_at';

    this.apiService.getMultimediasFromLocal(queryParams, queryProps).subscribe(
      (result: any) => {
        this.loading = false;
        // TODO: set multimedias to record
        this.currentRecord.multimedias = result.data.multimedias;
        // this.apiService.setRecord(result.data.record);
        // this.setCurrentRecord(result.data.record);

        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  savePhysical() {
    // this.loading = true;
    // const data = this.physical.value;

    // const physical_ta =
    //   data.physical_ta !== '' && data.physical_ta != null ? `physical_ta: "${data.physical_ta}",` : 'physical_ta: ".",';
    // const physical_fc =
    //   data.physical_fc !== '' && data.physical_fc != null ? `physical_fc: "${data.physical_fc}",` : 'physical_fc: ".",';
    // const weight = data.weight !== '' && data.weight != null ? `weight: "${data.weight}",` : 'weight: ".",';
    // const height = data.height !== '' && data.height != null ? `height: "${data.height}",` : 'height: ".",';
    // const head = data.head !== '' && data.head != null ? `head: "${data.head}",` : 'head: ".",';
    // const neck = data.neck !== '' && data.neck != null ? `neck: "${data.neck}",` : 'neck: ".",';
    // const thorax = data.thorax !== '' && data.thorax != null ? `thorax: "${data.thorax}",` : 'thorax: ".",';
    // const pregnancy =
    //   data.pregnancy !== '' && data.pregnancy != null ? `pregnancy: "${data.pregnancy}",` : 'pregnancy: ".",';
    // const exams = data.exams !== '' && data.exams != null ? `exams: "${data.exams}",` : 'exams: ".",';

    // const queryParams = `record_id: "${
    //   this.currentRecord.identification
    // }", ${physical_ta} ${physical_fc} ${weight} ${height} ${head} ${neck} ${thorax} ${exams} ${pregnancy}`;
    // const queryProps =
    //   // tslint:disable-next-line:max-line-length
    //   'id,identification, patient{id, name, identification, civil_status, position, birth_date, phone, address, company, email, partner_name, partner_profession}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process}, multimedias{id,name,description,url,type,status,created_at}, created_at';

    // this.apiService.savePhysical(queryParams, queryProps).subscribe(
    //   (response: any) => {
    //     this.loading = false;

    //     this.apiService.setRecord(response.data.savePhysical);

    //     this.snackBar.open('Guardado', null, {
    //       duration: 4000
    //     });
    //   },
    //   error => {
    //     this.loading = false;
    //     this.snackBar.open('Error.', null, {
    //       duration: 4000
    //     });

    //     console.log(error);
    //   }
    // );
  }

  saveDetails() {
    this.loading = true;
    const data = this.details.value;
    console.log(data);

    const motive = data.motive !== '' ? `motive: "${encodeURIComponent(data.motive)}",` : 'motive: ".",';
    const menarche = data.menarche !== '' && data.menarche != null ? `menarche: "${data.menarche}",` : 'menarche: ".",';
    const cycles = data.cycles !== '' && data.cycles != null ? `cycles: "${data.cycles}",` : 'cycles: ".",';
    const record_fur =
      data.record_fur !== '' && data.record_fur != null
        ? `record_fur: "${moment(data.record_fur).format('YYYY-MM-DD')}",`
        : 'record_fur: ".",';
    const record_g = data.record_g !== '' && data.record_g != null ? `record_g: "${data.record_g}",` : 'record_g: ".",';
    const record_p = data.record_p !== '' && data.record_p != null ? `record_p: "${data.record_p}",` : 'record_p: ".",';
    const record_v = data.record_v !== '' && data.record_v != null ? `record_v: "${data.record_v}",` : 'record_v: ".",';
    const record_a = data.record_a !== '' && data.record_a != null ? `record_a: "${data.record_a}",` : 'record_a: ".",';
    const record_pp =
      data.record_pp !== '' && data.record_pp != null ? `record_pp: "${data.record_pp}",` : 'record_pp: ".",';
    const record_up =
      data.record_up !== '' && data.record_up != null ? `record_up: "${data.record_up}",` : 'record_up: ".",';
    const record_prs =
      data.record_prs !== '' && data.record_prs != null ? `record_prs: "${data.record_prs}",` : 'record_prs: ".",';
    const record_fpp =
      data.record_fpp !== '' && data.record_fpp != null ? `record_fpp: "${data.record_fpp}",` : 'record_fpp: ".",';
    const amenorrhea =
      data.amenorrhea !== '' && data.amenorrhea != null ? `amenorrhea: "${data.amenorrhea}",` : 'amenorrhea: ".",';

    const queryParams = `record_id: "${
      this.currentRecord.identification
    // tslint:disable-next-line:max-line-length
    }", ${motive} ${menarche} ${cycles} ${record_fur} ${record_g} ${record_p} ${record_v} ${record_a} ${record_pp} ${record_up} ${record_prs}  ${record_fpp} ${amenorrhea}`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id,identification, patient{id, name, identification, civil_status, position, birth_date, phone, address, company, email, partner_name, partner_profession}, details{id, motive, menarche, cycles, record_fur, record_g, record_p, record_v, record_a, record_pp, record_up, record_prs, record_fpp, amenorrhea}, physical{id,physical_ta, physical_fc, weight, height, head, neck, thorax, pregnancy, exams}, evolutions{id, date, details, rejuv, mona}, observations{id, description}, pregnancies{id,date,description}, coombs{id,date,description}, htos{id,date,description}, hbs{id,date,description}, cits{id,date,description}, vaccines{id,date,description}, citologies{id,date,description}, laboratory{id, patient_group, patient_rh, partner_group, partner_rh}, labor{id, date, time, labor_ta, labor_fcf, membranes, presentation, observations}, birth{id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations}, conclusion{id, surgical, pathological, notes, diagnosis, tests, behavior, process}, multimedias{id,name,description,url,type,status,created_at}, created_at';

    this.apiService.saveRecord(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.apiService.setRecord(response.data.saveRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveEvolution() {
    this.loading = true;
    const data = this.evolution.value;

    const details = `details: "${encodeURIComponent(data.details)}",`;
    const queryParams = `record_id: "${this.currentRecord.identification}", ${details}`;
    const queryProps = 'id, details';

    this.apiService.saveEvolution(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.evolution = response.data.saveEvolution;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  openPregnanciesModal() {
    const dialogRef = this.dialog.open(PregnanciesModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openCitologiesModal() {
    const dialogRef = this.dialog.open(CitologiesModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openCoombsModal() {
    const dialogRef = this.dialog.open(CoombsModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openHtoModal() {
    const dialogRef = this.dialog.open(htoModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openHbModal() {
    const dialogRef = this.dialog.open(HbModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openCitModal() {
    const dialogRef = this.dialog.open(CitModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openVaccinesModal() {
    const dialogRef = this.dialog.open(VaccinesModalComponent, {
      width: '680px',
      height: '500px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openObsModal() {
    const dialogRef = this.dialog.open(ObsModalComponent, {
      width: '580px',
      height: '400px',
      maxHeight: '800px',
      data: {
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.currentRecord.observations = result;
      }

      console.log(result);
    });
  }

  openEvoModal(evolution: any = null) {
    const dialogRef = this.dialog.open(EvolutionModalComponent, {
      width: '580px',
      height: '480px',
      maxHeight: '800px',
      data: {
        evolution: evolution,
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      this.getRecord(this.currentRecord.identification);

      console.log(result);
    });
  }

  openPhoto2Modal(): void {
    // const dialogRef = this.dialog.open(PhotoModal2Component, {
    //   width: '548px',
    //   height: '600px',
    //   maxHeight: '800px',
    //   data: {
    //     record: this.currentRecord
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.currentRecord.multimedias.push(result);
    //   }
    // });
  }

  /**
   *
   *
   * BEFORE BIRTH CONTROL
   *
   *
   */

  sortControl(event: Sort): void {
    this.orderBy = event.active;
    this.order = event.direction;

    // this.loadControl();
  }

  pageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    // this.loadRecords();
  }

  loadControls() {
    // console.log('loading records...');

    this.loadingControls = true;

    const queryParams = `record_id: "${this.currentRecord.identification}"`;
    const queryProps =
      'id, date, weight, week, control_t, control_a, control_pam, control_au, pression, fcf, edema, created_at';

    this.apiService.getControls(queryParams, queryProps).subscribe(
      (response: any) => {
        this.controlsData = response.data.controls;
        this.loadingControls = false;
      },
      error => {
        this.loadingControls = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }

  openControlModal(control: any = null) {
    const dialogRef = this.dialog.open(ControlModalComponent, {
      width: '460px',
      data: {
        control: control,
        record: this.currentRecord
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadControls();
    });
  }

  /**
   *
   *
   *
   */

  saveLaboratory() {
    this.loading = true;
    const data = this.laboratory.value;
    console.log(this.laboratory.value);

    const patient_group =
      data.patient_group !== '' && data.patient_group !== null
        ? `patient_group: "${data.patient_group}",`
        : `patient_group: ".",`;
    const patient_rh =
      data.patient_rh !== '' && data.patient_rh !== null
        ? `patient_rh: "${encodeURIComponent(data.patient_rh)}",`
        : `patient_rh: ".",`;
    const partner_group =
      data.partner_group !== '' && data.partner_group !== null
        ? `partner_group: "${data.partner_group}",`
        : `partner_group: ".",`;
    const partner_rh =
      data.partner_rh !== '' && data.partner_rh !== null
        ? `partner_rh: "${encodeURIComponent(data.partner_rh)}",`
        : `partner_rh: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    }", ${patient_group} ${patient_rh} ${partner_group} ${partner_rh}`;
    const queryProps = 'id, patient_group, patient_rh, partner_group, partner_rh';

    this.apiService.saveLaboratory(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.laboratory = response.data.saveLaboratory;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveLabor() {
    this.loading = true;
    const data = this.labor.value;

    const date =
      data.date !== '' && data.date != null ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : 'date: ".",';
    const time = data.time !== '' && data.time !== null ? `time: "${data.time}",` : `time: ".",`;
    const labor_ta =
      data.labor_ta !== '' && data.labor_ta !== null ? `labor_ta: "${data.labor_ta}",` : `labor_ta: ".",`;
    const labor_fcf =
      data.labor_fcf !== '' && data.labor_fcf !== null ? `labor_fcf: "${data.labor_fcf}",` : `labor_fcf: ".",`;
    const membranes =
      data.membranes !== '' && data.membranes !== null ? `membranes: "${data.membranes}",` : `membranes: ".",`;
    const presentation =
      data.presentation !== '' && data.presentation !== null
        ? `presentation: "${data.presentation}",`
        : `presentation: ".",`;
    const observations =
      data.observations !== '' && data.observations !== null
        ? `observations: "${data.observations}",`
        : `observations: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    }", ${date} ${time} ${labor_ta} ${labor_fcf} ${membranes} ${presentation} ${observations}`;
    const queryProps = 'id, date, time, labor_ta, labor_fcf, membranes, presentation, observations';

    this.apiService.saveLabor(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.labor = response.data.saveLabor;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveBirth() {
    this.loading = true;
    const data = this.birth.value;

    const date =
      data.date !== '' && data.date != null ? `date: "${moment(data.date).format('YYYY-MM-DD')}",` : 'date: ".",';
    const time = data.time !== '' && data.time !== null ? `time: "${data.time}",` : `time: ".",`;
    const type = data.type !== '' && data.type !== null ? `type: "${data.type}",` : `type: ".",`;
    const episiotomy =
      data.episiotomy !== '' && data.episiotomy !== null ? `episiotomy: "${data.episiotomy}",` : `episiotomy: ".",`;
    const alum = data.alum !== '' && data.alum !== null ? `alum: "${data.alum}",` : `alum: ".",`;
    const blood_loss =
      data.blood_loss !== '' && data.blood_loss !== null ? `blood_loss: "${data.blood_loss}",` : `blood_loss: ".",`;
    const oxytocic =
      data.oxytocic !== '' && data.oxytocic !== null ? `oxytocic: "${data.oxytocic}",` : `oxytocic: ".",`;
    const anesthesia =
      data.anesthesia !== '' && data.anesthesia !== null ? `anesthesia: "${data.anesthesia}",` : `anesthesia: ".",`;
    const sex = data.sex !== '' && data.sex !== null ? `sex: "${data.sex}",` : `sex: ".",`;
    const weight = data.weight !== '' && data.weight !== null ? `weight: "${data.weight}",` : `weight: ".",`;
    const height = data.height !== '' && data.height !== null ? `height: "${data.height}",` : `height: ".",`;
    const size = data.size !== '' && data.size !== null ? `size: "${data.size}",` : `size: ".",`;
    const observations =
      data.observations !== '' && data.observations !== null
        ? `observations: "${data.observations}",`
        : `observations: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    // tslint:disable-next-line:max-line-length
    }", ${date} ${time} ${type} ${episiotomy} ${alum} ${blood_loss} ${oxytocic} ${anesthesia} ${sex} ${weight} ${height} ${size} ${observations}`;
    const queryProps =
      // tslint:disable-next-line:max-line-length
      'id, date, time, type, episiotomy, alum, blood_loss, oxytocic, anesthesia, sex, weight, height, size, observations';

    this.apiService.saveBirth(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.birth = response.data.saveBirth;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveConclusion() {
    this.loading = true;
    const data = this.conclusion.value;

    const surgical =
      data.surgical !== '' && data.surgical !== null ? `surgical: "${data.surgical}",` : `surgical: ".",`;
    const pathological =
      data.pathological !== '' && data.pathological !== null
        ? `pathological: "${data.pathological}",`
        : `pathological: ".",`;
    const notes = data.notes !== '' && data.notes !== null ? `notes: "${data.notes}",` : `notes: ".",`;
    const diagnosis =
      data.diagnosis !== '' && data.diagnosis !== null ? `diagnosis: "${data.diagnosis}",` : `diagnosis: ".",`;
    const tests = data.tests !== '' && data.tests !== null ? `tests: "${data.tests}",` : `tests: ".",`;
    const behavior =
      data.behavior !== '' && data.behavior !== null ? `behavior: "${data.behavior}",` : `behavior: ".",`;
    const process = data.process !== '' && data.process !== null ? `process: "${data.process}",` : `process: ".",`;

    const queryParams = `record_id: "${
      this.currentRecord.identification
    }", ${surgical} ${pathological} ${notes} ${diagnosis} ${tests} ${behavior} ${process}`;
    const queryProps = 'id, surgical, pathological, notes, diagnosis, tests, behavior, process';

    this.apiService.saveConclusion(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.conclusion = response.data.saveConclusion;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      error => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  furChange($event: any) {
    let date = moment(this.details.controls.record_fur.value);
    if (date.isValid()) {
      let fpp = date.add(10, 'days').add(1, 'year').subtract(3, 'months');
      this.details.controls.record_fpp.setValue(fpp.format('DD/MM/YYYY'));

      this.setAmenhorrea(this.details.controls.record_fur.value);
      this.setDaysUntilBirth(fpp);
    }
  }

  setAmenhorrea(date: any) {
    let dateParsed = moment(date);
    if (dateParsed.isValid()) {
      const now = moment();
      this.details.controls.amenorrhea_text
        .setValue(now.diff(dateParsed, 'days') + ' días (' + now.diff(dateParsed, 'weeks') + ' semanas)');
    }
  }

  setDaysUntilBirth(date: any) {

  }

  setStrSpaces(string: string) {
    return string.replace(/<br>/g, '\n');
  }

  civilToString(civil_status: any) {
    if (civil_status === 1) return 'Soltero/a';
    if (civil_status === 2) return 'Casado/a';
    if (civil_status === 3) return 'Unión Libre';
    if (civil_status === 4) return 'Divorciado/a';
    if (civil_status === 5) return 'Viudo/a';

    return 'Otro';
  }

  ageFromDate(date: string) {
    return moment().diff(moment(date), 'years');
  }

  openPatient(patient: any): void {
    const dialogRef = this.dialog.open(PatientFormModalComponent, {
      width: '500px',
      height: '562px',
      maxHeight: '800px',
      data: {
        patient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('patients form closed');
      if (result) {
        this.currentPatient = result;
      }
    });
  }

  savePopq() {
    this.loading = true;
    const data = this.popq.value;

    const popq_Aa = data.popq_Aa !== '' && data.popq_Aa !=  null ? `popq_Aa: "${data.popq_Aa}",` : `popq_Aa: ".",`;
    const popq_Ba = data.popq_Ba !== '' && data.popq_Ba !=  null ? `popq_Ba: "${data.popq_Ba}",` : `popq_Ba: ".",`;
    const popq_C = data.popq_C !== '' && data.popq_C !=  null ? `popq_C: "${data.popq_C}",` : `popq_C: ".",`;
    const popq_gh = data.popq_gh !== '' && data.popq_gh !=  null ? `popq_gh: "${data.popq_gh}",` : `popq_gh: ".",`;
    const popq_pb = data.popq_pb !== '' && data.popq_pb !=  null ? `popq_pb: "${data.popq_pb}",` : `popq_pb: ".",`;
    const popq_tvl = data.popq_tvl !== '' && data.popq_tvl !=  null ?
      `popq_tvl: "${data.popq_tvl}",` : `popq_tvl: ".",`;
    const popq_Ap = data.popq_Ap !== '' && data.popq_Ap !=  null ? `popq_Ap: "${data.popq_Ap}",` : `popq_Ap: ".",`;
    const popq_Bp = data.popq_Bp !== '' && data.popq_Bp !=  null ? `popq_Bp: "${data.popq_Bp}",` : `popq_Bp: ".",`;
    const popq_D = data.popq_D !== '' && data.popq_D !=  null ? `popq_D: "${data.popq_D}",` : `popq_D: ".",`;

    // tslint:disable-next-line:max-line-length
    const queryParams = `record_id: "${this.currentRecord.identification}", ${popq_Aa} ${popq_Ba} ${popq_C} ${popq_gh} ${popq_pb} ${popq_tvl} ${popq_Ap} ${popq_Bp} ${popq_D}`;
    const queryProps = 'id, popq_Aa, popq_Ba, popq_C, popq_gh, popq_pb, popq_tvl, popq_Ap, popq_Bp, popq_D';

    this.apiService.savePopq(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loading = false;

        this.currentRecord.popq = response.data.savePopq;
        this.apiService.setRecord(this.currentRecord);

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });
      },
      (error: any) => {
        this.loading = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  open(index: number): void {
    // open lightbox
    console.log(index);
    console.log(this.currentRecord.multimedias);
    this._lightbox.open(this.currentRecord.multimedias
      .filter((multimedia: any) => multimedia.type === 1).map((multimedia: any) => {
      multimedia['src'] = multimedia.url;
      multimedia['caption'] = multimedia.description;
      return multimedia;
    }), index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  openVideo(multimedia: any) {

  }

  deleteMultimedia(multimedia: any) {
    var r = confirm('¿Seguro que desea eliminar el archivo?');
    if (r === true) {
      this.loading = true;

      const id = multimedia ? `id: ${multimedia.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.saveLocalMultimedia(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecordMultimedia(this.currentRecord.identification);

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }

  openMultimediaModal(multimedia: any) {
    const dialogRef = this.dialog.open(MultimediaModalComponent, {
      width: '480px',
      height: '504px',
      maxHeight: '800px',
      data: {
        multimedia: multimedia
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {return; }

      this.getRecordMultimedia(this.currentRecord.identification);
    });
  }

  openPhotoModal(patient: any): void {
    const dialogRef = this.dialog.open(PhotoModalComponent, {
      width: '548px',
      height: '600px',
      maxHeight: '800px',
      data: {
        patient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentPatient.profile_url = result;
      }
    });
  }

  toPrint() {
    const url = `/#/records/print/${this.apiService.currentRecord.identification}`;
    const win = window.open(url, '_blank');
    win.focus();
    // this.router.navigate(['/records/print', this.apiService.currentRecord.identification]);
  }
}
