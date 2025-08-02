import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import icHistory from '@iconify/icons-feather/plus-square';
import { ApiService } from 'src/app/core/api/api.service';
import { CoreService } from 'src/app/core/core.service';
import { Appointment } from 'src/app/models/appointment';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { AppointmentModalComponent } from 'src/app/modals/appointmentModal/appointment-modal.component';
import edit from '@iconify/icons-fa-solid/pen-square';


@Component({
  selector: 'vex-panel-cliente',
  templateUrl: './panel-cliente.component.html',
  styleUrls: ['./panel-cliente.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
]
})
export class PanelClienteComponent implements OnInit {
  displayedColumns: string[] = ['fecha_despacho','hora_cargue', 'hora_obra' , 'ultima_actualizacion', 'direccion', 'descarga', 'concreto','m3','conductor','estado'];
  loadingRecords = false;
  datosAppointment: any[] = [];
  limit = 10;
  offset = 0;
  datos: any[] = [];
  cantidad_citas:any;
  data: any[] = [];
  resultsLength = 0;
  dataSource: MatTableDataSource<Appointment> | null;
  dataPagination: any[] = [];
  dataUser: Appointment[] = [];
  dataSourceUser: MatTableDataSource<Appointment> | null;
  resultsLength1 = 0;
  orderBy = 'time';
  order = 'upward';
  dataPanelCliente:Appointment[] = [];
  icHistory=icHistory;
  edit=edit;


  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
});


  getRoleId(){
    return this.coreService.currentUser.role_id;
  }

  getClienteId(){
    return this.coreService.currentUser.id;
  }

  openAppointmentModal(appointment: any = null) {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
        width: '680px',
        height: 'auto',
        data: {
            cliente_id:this.getClienteId()
        }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(this.getRoleId()==8){
        console.log("Este es id del cliente:");
        console.log(this.dataPanelCliente);
        this.loadPanelCliente();
        this.dataPanelCliente;
      }
    });
}


  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private coreService: CoreService){}

    loadPanelCliente(){
      console.log('loading records...');
      this.loadingRecords = true;
      console.log("Id del cliente");
      console.log(this.getClienteId());
      const patient = this.getClienteId() !== null || this.getClienteId() !== undefined ? `user_id: ${this.getClienteId()},` : '';
      const queryParams = `${patient}`;
      const queryProps =
          'id, date, status, time, updated_at, end_time, updated_at, direccion, tipo_descarga, type_concreto, metros, conductor';
      this.apiService.getPanelCliente(queryParams, queryProps).subscribe(
          (response: any) => {
              this.dataPanelCliente = response.data.panelCliente;
          },
          error => {
              this.loadingRecords = false;
              this._snackBar.open(error, null, {
                  duration: 4000
              });
              console.log(error);
          }
      );
  }
  


  ngOnInit(): void {
    if(this.getRoleId()==8){
      console.log("Este es id del cliente:");
      console.log(this.dataPanelCliente);
      this.loadPanelCliente();
      this.dataPanelCliente;
    }

  }

}
