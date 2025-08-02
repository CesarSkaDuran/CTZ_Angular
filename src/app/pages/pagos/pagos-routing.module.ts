import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagosComponent } from './pagos.component';

const routes: Routes = [
    {
        path: '',
        component: PagosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagosRoutingModule { }
