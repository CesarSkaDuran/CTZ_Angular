import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagoFacturaComponent } from './pago-factura.component';

const routes: Routes = [
    {
        path: '',
        component:PagoFacturaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagoFacturaRoutingModule {
    
}