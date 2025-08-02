import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, timeout } from 'rxjs/operators';
import { Lightbox } from 'ngx-lightbox';
import { of, timer } from 'rxjs';

import * as moment from 'moment';
import * as autosize from 'autosize';

import icDelete from '@iconify/icons-ic/twotone-delete';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDone from '@iconify/icons-ic/twotone-done';
import icBlock from '@iconify/icons-ic/twotone-block';
import icRemove from '@iconify/icons-ic/twotone-remove';
import icPerson from '@iconify/icons-ic/twotone-person';
import icAssign from '@iconify/icons-ic/twotone-assignment';
import { HttpClient } from '@angular/common/http';
import { RecordsService } from '../records/records.service';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { CredentialsService } from 'src/app/core';
import { ApiService } from 'src/app/core/api/api.service';
import { SplashScreenService } from 'src/@vex/services/splash-screen.service';

@Component({
  selector: 'app-print-record',
  templateUrl: './print-record.component.html',
  styleUrls: ['./print-record.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class PrintRecordComponent implements OnInit {
  displayedControlColumns: string[] = ['week', 'weight', 'ta', 'pam', 'au', 'pression', 'fcf', 'edema', 'options'];
  controlsData: any[] = [];

  icDelete = icDelete;
  icEdit = icEdit;
  icDone = icDone;
  icBlock = icBlock;
  icRemove = icRemove;
  icPerson = icPerson;
  icAssign = icAssign;

  searchText = '';
  resultsLength = 0;
  loadingControls = false;
  currentRecord: any = null;
  loading = false;

  orderBy = 'created_at';
  order = 'asc';
  limit = 50;
  offset = 0;
  spaceRegex = /<br *\/?>/gi;

  constructor(
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private credentialsService: CredentialsService,
    private apiService: ApiService,
    private _lightbox: Lightbox,
    private splashScreen: SplashScreenService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    // set cached record if exist

    this.setRecordFromCache();

    const record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('recordId'))));

    record$.subscribe(recordId => {
      this.getRecord(recordId);
      // this.getRecordMultimedia(recordId);
    });

    document.body.classList.add('overflow-auto');

    // this.openPregnanciesModal();
  }

  setRecordFromCache() {
    const currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }

  setCurrentRecord(record: any) {
    this.currentRecord = record;
    console.log(record);
    this.loadControls();
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

        // this.getRecordMultimedia(id);
        this.splashScreen.hide();

        setTimeout(() => {
          autosize(document.querySelectorAll('textarea'));
        }, 1500);

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
        console.log(error);
      }
    );
  }

  setDaysUntilBirth(date: any) {

  }

  setStrSpaces(string: string) {
    return string.replace(/<br>/g, '\n');
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  civilToString(civil_status: any) {
    if (civil_status === 1) {return 'Soltero/a'; }
    if (civil_status === 2) {return 'Casado/a'; }
    if (civil_status === 3) {return 'Unión Libre'; }
    if (civil_status === 4) {return 'Divorciado/a'; }
    if (civil_status === 5) {return 'Viudo/a'; }

    return 'Otro';
  }

  print() {
    window.print();
  }

  ageFromDate(date: string) {
    if (date === '') {
      return '';
    }

    return moment().diff(moment(date), 'years');
  }
}
