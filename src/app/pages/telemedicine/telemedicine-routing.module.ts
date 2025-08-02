import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TelemedicineComponent } from './telemedicine.component';

const routes: Routes = [{ path: '', component: TelemedicineComponent, data: { title: 'Telemedicine' } }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TelemedicineRoutingModule { }
