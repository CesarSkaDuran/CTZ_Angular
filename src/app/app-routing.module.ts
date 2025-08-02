import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { AuthenticationGuard } from './core';
import { HomeComponent } from './pages/home/home.component';
import { ConductoresModule } from './pages/conductores/conductores.module';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

const childrenRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
    // loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'records',
    loadChildren: () => import('./pages/records/records.module').then(m => m.RecordsModule),
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientesVista/clientes-vista.module').then(m => m.ClientesVistaModule),
  },
  {
    path: 'panelcliente',
    loadChildren: () => import('./pages/panelCliente/panel-cliente.module').then(m => m.PanelClienteModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuariosVista/usuarios-vista.module').then(m => m.UsuariosVistaModule),
  },
  {
    path: 'appointment',
    loadChildren: () => import('./pages/appointment/appointment.module').then(m => m.AppointmentModule)
  },
  {
    path: 'administration',
    loadChildren: () => import('./pages/administration/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: 'aprobacion',
    loadChildren: () => import('./pages/aprobacion/aprobacion.module').then(m => m.AprobacionModule)
  },
  {
    path: 'telemedicine',
    loadChildren: () => import('./pages/telemedicine/telemedicine.module').then(m => m.TelemedicineModule)
  },
  {
    path: 'records/view/:recordId',
    loadChildren: () => import('./pages/userRecord/user-record.module').then(m => m.UserRecordModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then(m => m.ProductosModule)
  },
  {
    path: 'vendedores',
    loadChildren: () => import('./pages/vendedores/vendedores.module').then(m => m.VendedoresModule)
  },
  /*
  {
    path: 'estadisticas',
    loadChildren: () => import('./pages/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent)
  },*/
  {
    path: 'conductores',
    loadChildren: () => import('./pages/conductores/conductores.module').then(m => m.ConductoresModule)
  },
  {path: 'estadisticas',component: EstadisticasComponent},
  {
    path: 'pagos',
    loadChildren: () => import('./pages/pagos/pagos.module').then(m => m.PagosModule)
  },
  {
    path: 'despachos',
    loadChildren: () => import('./pages/despachos/despachos.module').then(m => m.DespachosModule)
  },
  {
    path: 'detalleusuario/:id',
    loadChildren: () => import('./pages/detalleUsuarios/detalle-usuarios.module').then(m => m.DetalleUsuariosModule)
  },
  {
    path: 'pagofactura/:id',
    loadChildren: () => import('./pages/pagoFactura/pago-factura.module').then(m => m.PagoFacturaModule)
  },
  
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'records/print/:recordId',
    loadChildren: () => import('./pages/printRecord/print-record.module').then(m => m.PrintRecordModule)
  },
  {
    path: 'app',
    component: ShellComponent,
    children: childrenRoutes,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
