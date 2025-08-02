import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintRecordComponent } from './print-record.component';

const routes: Routes = [
  {
    path: '',
    component: PrintRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRecordsRoutingModule {}
