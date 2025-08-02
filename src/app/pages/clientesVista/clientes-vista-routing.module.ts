import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesVistaComponent } from './clientes-vista.component';

const routes: Routes = [
    {
        path: '',
        component: ClientesVistaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesVistaRoutingModule { }
