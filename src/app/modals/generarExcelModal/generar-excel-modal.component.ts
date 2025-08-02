import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';


@Component({
  selector: 'vex-generar-excel-modal',
  templateUrl: './generar-excel-modal.component.html',
  styleUrls: ['./generar-excel-modal.component.scss']
})
export class GenerarExcelModalComponent implements OnInit {

  loadingRecords=false;
  data: any[] = [];
  datosAppointment: any[] = [];
  dataCitasExcel: any[] = [];

  fechaFiltros = new FormGroup({
    date: new FormControl('', []),
    date2: new FormControl('', []),
  });

  ELEMENT_DATA = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];


  constructor(private apiService: ApiService,private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<GenerarExcelModalComponent>) { }


  guardarCitasExcel(){
    //this.exportToExcel(this.ELEMENT_DATA,'my_export');
    this.loadAppointmentPaginator();
  }

  editarCitas(){
    for(let cita of this.datosAppointment){
        this.dataCitasExcel.push({
            'Id': cita.id,
            'Cliente':cita.name,
            'Tipo descarga':cita.tipo_descarga,
            'Vendedor':cita.vendedor,
            'Dirección':cita.direccion,
            'Metros 3':cita.metros,
            'Observaciones':cita.observaciones,
            'Fecha despacho':cita.date,
            'Hora cargue':cita.time,
            'Hora en obra':cita.end_time,
            'Tipo de concreto':cita.type_concreto,
            'm³':cita.metros
        });
    }

    this.exportToExcel(this.dataCitasExcel,'PEDIDOS_CTZ');
}


  exportToExcel(json:any[], excelFileName:String){
    const worksheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook : XLSX.WorkBook = { Sheets:{'data':worksheet}, SheetNames:['data'] };
    const excelBuffer: any = XLSX.write(workbook,{bookType:'xlsx', type:'array'});
    this.saveAsExcel(excelBuffer,excelFileName);
  }

  saveAsExcel(buffer:any, fileName:String){
    const data: Blob = new Blob([buffer],{type:EXCEL_TYPE});
    FileSaver.saveAs(data, fileName+"_"+moment().format('YYYY-MM-DD_HH_mm_ss')+".xlsx");
  }


  loadAppointmentPaginator() {
    this.loadingRecords = true;
    const date =
        this.fechaFiltros.value.date !== '' && this.fechaFiltros.value.date !== null && this.fechaFiltros.value.date2 !== undefined
            ? `date: "${moment(this.fechaFiltros.value.date).format('YYYY-MM-DD')}",`
            : `date: "${moment().format('YYYY-MM-DD')}",`;
    const date2 =
        this.fechaFiltros.value.date2 !== '' && this.fechaFiltros.value.date2 !== null && this.fechaFiltros.value.date2 !== undefined
            ? `date2: "${moment(this.fechaFiltros.value.date2).format('YYYY-MM-DD')}",`
            : `date2: "${moment().format('YYYY-MM-DD')}",`;
    const searchText = this.fechaFiltros.value.search !== '' ? `search: "${this.fechaFiltros.value.search}",` : '';
    const queryParams = `${date} ${date2}`;
    const queryProps =
        'data{id, name, observaciones, company, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, patient{ id, name, color  }, doctor{ id, name, } }, total';

    this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
        (response: any) => {
            this.datosAppointment = response.data.appointmentsPagination.data;
            this.editarCitas();

        },
        error => {
            console.log("Este es el error:");
            console.log(error);
            this.loadingRecords = false;
            this._snackBar.open('Error.', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
  }


  close() {
    this.dialogRef.close();
  }



  ngOnInit(): void {
  }

}
