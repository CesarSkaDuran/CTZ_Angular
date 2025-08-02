import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendedoresComponent } from './vendedores.component';

const routes: Routes = [
    {
        path: '',
        component: VendedoresComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendedoresRoutingModule { }
