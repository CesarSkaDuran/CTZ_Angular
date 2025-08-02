import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { trackByRoute } from '../../utils/track-by';
import { NavigationService } from '../../services/navigation.service';
import icRadioButtonChecked from '@iconify/icons-ic/twotone-radio-button-checked';
import icRadioButtonUnchecked from '@iconify/icons-ic/twotone-radio-button-unchecked';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import { Patient } from 'src/app/models/patient';
import { Subscription } from 'rxjs';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import icPrint from '@iconify/icons-ic/twotone-print';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api/api.service';
import { PhotoModalComponent } from 'src/app/modals/photoModal/photo-modal.component';
import { PatientFormModalComponent } from 'src/app/modals/patientFormModal/patient-form-modal.component';
import moment from 'moment';
import { Location } from '@angular/common';
import { CoreService } from 'src/app/core/core.service';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() collapsed: boolean;
  collapsed1 = true;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(map(config => config.sidenav.title));
  imageUrl$ = this.configService.config$.pipe(map(config => config.sidenav.imageUrl));
  showCollapsePin$ = this.configService.config$.pipe(map(config => config.sidenav.showCollapsePin));

  items = this.navigationService.items;


  trackByRoute = trackByRoute;
  icRadioButtonChecked = icRadioButtonChecked;
  icRadioButtonUnchecked = icRadioButtonUnchecked;
  currentPatient: Patient;
  patientSelectedListener: Subscription;
  companySelectionListener: Subscription;
  currentCompany: any;
  icBack = icBack;
  icPrint = icPrint;
  rol_usuario: any;

  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private location: Location,
              private dialog: MatDialog,
              private apiService: ApiService,
              private coreService: CoreService
              ) { }

  ngOnInit() {
    this.coreService.rol_actual$.emit('***');

    this.rol_usuario=this.coreService.currentUser.role_id;

    console.log("Lista de items:");
    console.log(this.items);

  }

  ngAfterViewInit(): void {
    this.companySelectionListener = this.apiService.companySelected$.subscribe((company: Patient) => {
      // this.currentPatient = company;
      // this.loadDrivers();
    });
  }

  onMouseEnter() {
    this.layoutService.collapseOpenSidenav();
  }

  onMouseLeave() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed1 ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav(); 
  }

  civilToString(civil_status: any) {
    if (civil_status === 1) return 'Soltero/a';
    if (civil_status === 2) return 'Casado/a';
    if (civil_status === 3) return 'Unión Libre';
    if (civil_status === 4) return 'Divorciado/a';
    if (civil_status === 5) return 'Viudo/a';

    return 'Otro';
  }

  back() {
    this.location.back();
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
        patient: patient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('patients form closed');
      if (result) {
        this.currentPatient = result;
      }
    });
  }

  openPhotoModal(patient: any): void {
    const dialogRef = this.dialog.open(PhotoModalComponent, {
      width: '548px',
      height: '600px',
      maxHeight: '800px',
      data: {
        patient: patient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentPatient.profile_url = result;
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.patientSelectedListener) {
      this.patientSelectedListener.unsubscribe();
    }

    if (this.companySelectionListener) {
      this.companySelectionListener.unsubscribe();
    }
  }


  


  hiddeItem(label){

    console.log("Item aislado:");


    //console.log(this.items[0]);


    
  }
  

  toPrint() {
    const url = `/#/records/print/${this.apiService.currentRecord.identification}`;
    const win = window.open(url, '_blank');
    win.focus();
    // this.router.navigate(['/records/print', this.apiService.currentRecord.identification]);
  }
}
