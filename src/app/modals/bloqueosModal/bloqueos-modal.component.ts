import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api/api.service';
import baselineDeleteForever from '@iconify/icons-ic/baseline-delete-forever';
import { BloquerDiaModalComponent } from '../bloquerDiaModal/bloquer-dia-modal.component';

@Component({
  selector: 'vex-bloqueos-modal',
  templateUrl: './bloqueos-modal.component.html',
  styleUrls: ['./bloqueos-modal.component.scss']
})
export class BloqueosModalComponent implements OnInit {

  displayedColumns: string[] = ['fecha','hora_inicio','hora_fin','nombreusuario', 'acciones'];
  dataBloqueo: any []=[];
  loadingRecords = false;
  baselineDeleteForever = baselineDeleteForever;

  constructor(        private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  
  loadBloqueo(){
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `todo:1`;
    const queryProps =
        'id, fecha, hora_inicio, hora_fin, nombreusuario';
    this.apiService.getBloqueo(queryParams, queryProps).subscribe(
        (response: any) => {
            this.dataBloqueo = response.data.bloqueo;
        },
        error => {
            this.loadingRecords = false;
            this._snackBar.open('Error.', null, {
                duration: 4000
            });
            console.log(error);
        }
    );
  }

  borrar(id_bloqueo) {
    const queryParams = `id:${id_bloqueo}, delete: 1`;
    const queryProps = 'id';

    this.apiService.saveBloqueo(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loadBloqueo();
        this.dataBloqueo;
      },
      (error: any) => {
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }



  bloquearDiaModal(){
    const dialogRef = this.dialog.open(BloquerDiaModalComponent, {
        width: '680px',
        height: '300px',
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadBloqueo();
        this.dataBloqueo;
      });
  }


  ngOnInit(): void {
    this.loadBloqueo();
    this.dataBloqueo;
  }

}
