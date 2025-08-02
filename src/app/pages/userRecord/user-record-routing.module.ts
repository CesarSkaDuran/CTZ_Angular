import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRecordComponent } from './user-record.component';

const routes: Routes = [
  {
    path: '',
    component: UserRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRecordsRoutingModule {}
