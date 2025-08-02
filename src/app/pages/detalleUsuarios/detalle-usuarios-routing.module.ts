import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleUsuariosComponent } from './detalle-usuarios.component';

const routes: Routes = [
    {
        path: '',
        component: DetalleUsuariosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetalleUsuariosRoutingModule { }
