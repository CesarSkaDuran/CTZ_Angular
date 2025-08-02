import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { ShellModule } from './shell/shell.module';
import { CoreModule } from './core';
import { AdministrationModule } from './pages/administration/administration.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PatientsModalComponent } from './modals/patientsModal/patients-modal.component';
import { PatientFormModalComponent } from './modals/patientFormModal/patient-form-modal.component';
import { PregnanciesModalComponent } from './modals/pregnanciesModal/pregnancies-modal.component';
import { ControlModalComponent } from './modals/controlModal/control-modal.component';
import { CitologiesModalComponent } from './modals/citologiesModal/citologies-modal.component';
import { CoombsModalComponent } from './modals/coombsModal/coombs-modal.component';
import { htoModalComponent } from './modals/htoModal/hto-modal.component';
import { HbModalComponent } from './modals/hbModal/hb-modal.component';
import { CitModalComponent } from './modals/citModal/cit-modal.component';
import { VaccinesModalComponent } from './modals/vaccinesModal/vaccines-modal.component';
import { PhotoModalComponent } from './modals/photoModal/photo-modal.component';
import { ObsModalComponent } from './modals/obsModal/obs-modal.component';
import { IncomeModalComponent } from './modals/incomeModal/income-modal.component';
import { AppointmentModalComponent } from './modals/appointmentModal/appointment-modal.component';
import { EvolutionModalComponent } from './modals/evolutionModal/evolution-modal.component';
import { MultimediaModalComponent } from './modals/multimediaModal/multimedia-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { IconModule } from '@visurel/iconify-angular';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AppointmentModule } from './pages/appointment/appointment.module';
import { RecordsModule } from './pages/records/records.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VideoModalComponent } from './modals/videoModal/video-modal.component';
import { HomeModule } from './pages/home/home.module';
import { environment } from 'src/environments/environment';
import { NgxAgoraModule } from 'ngx-agora';
import { NewHistoryModalComponent } from './modals/newHistoryModal/newHistoryModal.component';
import { pagosModalComponent } from './modals/pagosModal/pagosModal.component';
import { UserAddModalComponent } from './modals/userAddModal/user-add-modal.component';
import { DetailsOrderModalComponent } from './modals/detailsOrderModal/details-order-modal.component';
import { ClienteModalComponent } from './modals/cliente/cliente-modal.component';
import { VendedorModalComponent } from './modals/vendedor/vendedor-modal.component';
import { CambiarProductoModalComponent } from './modals/cambiarProductor/cambiarProducto-modal.component';
import { CrearProductoComponent } from './modals/crearProducto/crearProducto-modal.component';
import { NuevoVendedorComponent } from './modals/crearVendedor/nuevo-vendedor-modal.component';
import { NuevoConductorComponent } from './modals/crearConductor/nuevo-conductor-modal.component';

// Import your library
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppointmentVendedorComponent } from './modals/appointmentVendedor/appointmentVendedor.component';
import { AppointmentDetailComponent } from './modals/appointmentDetail/appointmentDetail.component';
import { AppointmentPlantaComponent } from './modals/appointmentPlanta/appointmentPlanta.component';
import { AppointmentConductorComponent } from './modals/appointmentConductor/appointmentConductor.component';
import { ClientesVistaComponent } from './pages/clientesVista/clientes-vista.component';

import { MatTableModule } from '@angular/material/table';
import { RegistrarClienteModalComponent } from './modals/registrarClienteModal/registrar-cliente-modal.component';
import { UsuariosVistaComponent } from './pages/usuariosVista/usuarios-vista.component';
import { UsuarioRegistroModalComponent } from './modals/usuario-registro-modal/usuario-registro-modal.component';
import { RegistrarUsuarioModalComponent } from './modals/registrarUsuarioModal/registrar-usuario-modal.component';
import { ContraseniaUsuarioComponent } from './modals/contraseniaUsuario/contrasenia-usuario.component';
import { BloquerDiaModalComponent } from './modals/bloquerDiaModal/bloquer-dia-modal.component';
import { GenerarExcelModalComponent } from './modals/generarExcelModal/generar-excel-modal.component';
import { DetalleUsuariosComponent } from './pages/detalleUsuarios/detalle-usuarios.component';
import { SubirImagenModalComponent } from './modals/subirImagenModal/subir-imagen-modal.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { DespachosComponent } from './pages/despachos/despachos.component';
import { EstadoDespachoComponent } from './modals/estadoDespacho/estado-despacho.component';
import { UltimoPagoModalComponent } from './modals/ultimoPagoModal/ultimo-pago-modal.component';
import { InfoPagosModalComponent } from './modals/infoPagosModal/info-pagos-modal.component';
import { EstadoPagosModalComponent } from './modals/estadoPagosModal/estado-pagos-modal.component';
import { GenerarPagoModalComponent } from './modals/generarPagoModal/generar-pago-modal.component';
import { PagoFacturaComponent } from './pages/pagoFactura/pago-factura.component';
import { BloqueosModalComponent } from './modals/bloqueosModal/bloqueos-modal.component';
import { PanelClienteComponent } from './pages/panelCliente/panel-cliente.component';
import { AprobacionComponent } from './pages/aprobacion/aprobacion.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    PatientsModalComponent,
    PatientFormModalComponent,
    PregnanciesModalComponent,
    CitologiesModalComponent,
    ControlModalComponent,
    CoombsModalComponent,
    htoModalComponent,
    HbModalComponent,
    CitModalComponent,
    VaccinesModalComponent,
    ObsModalComponent,
    EvolutionModalComponent,
    IncomeModalComponent,
    PhotoModalComponent,
    AppointmentModalComponent,
    MultimediaModalComponent,
    VideoModalComponent,
    NewHistoryModalComponent,
    pagosModalComponent,
    UserAddModalComponent,
    DetailsOrderModalComponent,
    ClienteModalComponent,
    VendedorModalComponent,
    CambiarProductoModalComponent,
    CrearProductoComponent,
    NuevoVendedorComponent,
    NuevoConductorComponent,
    AppointmentVendedorComponent,
    AppointmentDetailComponent,
    AppointmentPlantaComponent,
    AppointmentConductorComponent,
    ClientesVistaComponent,
    RegistrarClienteModalComponent,
    UsuariosVistaComponent,
    UsuarioRegistroModalComponent,
    RegistrarUsuarioModalComponent,
    ContraseniaUsuarioComponent,
    BloquerDiaModalComponent,
    GenerarExcelModalComponent,
    DetalleUsuariosComponent,
    SubirImagenModalComponent,
    PagosComponent,
    DespachosComponent,
    EstadoDespachoComponent,
    UltimoPagoModalComponent,
    InfoPagosModalComponent,
    EstadoPagosModalComponent,
    GenerarPagoModalComponent,
    PagoFacturaComponent,
    BloqueosModalComponent,
    PanelClienteComponent,
    AprobacionComponent,
    EstadisticasComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ShellModule,
    RecordsModule,
    AdministrationModule,
    AppointmentModule,
    HomeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    FullCalendarModule,
    // Vex
    VexModule,
    CustomLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    IconModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    NgxChartsModule,
    
  ],
  entryComponents: [
    PatientsModalComponent,
    PatientFormModalComponent,
    PregnanciesModalComponent,
    ControlModalComponent,
    CitologiesModalComponent,
    CoombsModalComponent,
    htoModalComponent,
    HbModalComponent,
    CitModalComponent,
    VaccinesModalComponent,
    PhotoModalComponent,
    ObsModalComponent,
    IncomeModalComponent,
    AppointmentModalComponent,
    EvolutionModalComponent,
    MultimediaModalComponent,
    VideoModalComponent,
    NewHistoryModalComponent,
    pagosModalComponent,
    DetailsOrderModalComponent,
    ClienteModalComponent,
    VendedorModalComponent,
    CambiarProductoModalComponent,
    CrearProductoComponent,
    NuevoVendedorComponent,
    NuevoConductorComponent,
    AppointmentVendedorComponent,
    AppointmentDetailComponent,
    AppointmentPlantaComponent,
    AppointmentConductorComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-in' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
