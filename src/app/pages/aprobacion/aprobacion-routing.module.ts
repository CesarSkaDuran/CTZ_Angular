import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AprobacionComponent } from './aprobacion.component';

const routes: Routes = [
    {
        path: '',
        component: AprobacionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AprobacionRoutingModule { }
