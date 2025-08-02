import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosVistaComponent } from './usuarios-vista.component';

const routes: Routes = [
    {
        path: '',
        component: UsuariosVistaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosVistaRoutingModule { }
