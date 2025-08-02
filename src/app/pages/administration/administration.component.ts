import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
// import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { IncomeModalComponent } from '@app/components/modals/incomeModal/income-modal.component';


import icSearch from '@iconify/icons-ic/twotone-search';
import icMore from '@iconify/icons-ic/twotone-more-vert';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove from '@iconify/icons-ic/twotone-delete';
import { Record } from 'src/app/models/record';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ApiService } from 'src/app/core/api/api.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IncomeModalComponent } from 'src/app/modals/incomeModal/income-modal.component';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class AdministrationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'concept', 'company', 'value', 'options'];
  data: Record[] = [];

  searchText = '';
  loadingRecords = false;
  totalIncome: 0;

  icMore = icMore;
  icEdit = icEdit;
  icRemove = icRemove;

  patientsModalIsOpen = false;

  resultsLength = 0;
  pageSize = 500;
  pageSizeOptions: number[] = [500, 1000, 2500, 5000];
  orderBy = 'created_at';
  order = 'desc';
  limit = 500;
  offset = 0;

  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
  });

  // shortcuts: ShortcutInput[] = [];

  public keyUp = new Subject<any>();
  @ViewChild('search', { static: true }) searchEl: ElementRef;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) {
    const codeSearchSubscription = this.keyUp
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(700),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(400)))
      )
      .subscribe(result => {
        this.loadRecords();
      });
  }

  ngOnInit() {
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.searchEl.nativeElement.focus();

    // this.shortcuts.push(
    //   {
    //     key: ['shift + b'],
    //     command: e => console.log('clicked ', e.key),
    //     preventDefault: true
    //   },
    //   {
    //     key: ['shift + n'],
    //     command: e => console.log('clicked ', e.key),
    //     preventDefault: true
    //   }
    // );
  }

  // @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  searchKeyUp($event: KeyboardEvent): void {
    // console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
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
    // console.log('loading records...');
    // console.log(this.filters.value);

    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const date2 =
      this.filters.value.date2 !== '' && this.filters.value.date2 !== null
        ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
    const queryProps =
      'data{id, concept, company, date, value, status, created_at}, total';

    this.apiService.getIncomes(queryParams, queryProps).subscribe(
      (response: any) => {
        this.data = response.data.incomesPagination.data;
        this.resultsLength = response.data.incomesPagination.total;
        this.totalIncome = response.data.incomesPagination.data.length === 0
        ? 0 : response.data.incomesPagination.data.map((item: any) => parseFloat(item.value))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.loadingRecords = false;
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

  openIncomeModal(income: any = null) {
    const dialogRef = this.dialog.open(IncomeModalComponent, {
      width: '480px',
      height: '500px',
      maxHeight: '800px',
      data: {
        income: income
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      this.loadRecords();
      console.log(result);
    });
  }

  pageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.loadRecords();
  }

  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

  selectRecord(record: any) {
  }

  replaceSpace(str: string) {
    return str.replace(/<br>/g, '\n');
  }

  delete(income: any) {

    const r = confirm('¿Eliminar Ingreso?');
    if (r === true) {
      this.loadingRecords = true;

      const id = income ? `id: ${income.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id, concept, date, value, status';

      this.apiService.saveIncome(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.loadRecords();

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
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
  }
}
