import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelClienteComponent } from './panel-cliente.component';

const routes: Routes = [
    {
        path: '',
        component: PanelClienteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelClienteRoutingModule { }
