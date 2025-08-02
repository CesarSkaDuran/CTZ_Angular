import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConductoresComponent } from './conductores.component';

const routes: Routes = [
    {
        path: '',
        component: ConductoresComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConductoresRoutingModule { }
