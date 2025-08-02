import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrationComponent } from './administration.component';

const routes: Routes = [{ path: '', component: AdministrationComponent, data: { title: 'Administration' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
