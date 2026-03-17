import {
    Component, OnInit, AfterViewInit, OnDestroy,
    ViewChild, Inject
} from '@angular/core';
import * as moment from 'moment';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { PatientFormModalComponent } from '../patientFormModal/patient-form-modal.component';
import { UserAddModalComponent } from '../userAddModal/user-add-modal.component';
import { ClienteModalComponent } from '../cliente/cliente-modal.component';
import { VendedorModalComponent } from '../vendedor/vendedor-modal.component';
import { CambiarProductoModalComponent } from '../cambiarProductor/cambiarProducto-modal.component';
import { CrearProductoComponent } from '../crearProducto/crearProducto-modal.component';
import { Router } from '@angular/router';
import { NuevoVendedorComponent } from '../crearVendedor/nuevo-vendedor-modal.component';
import { NuevoConductorComponent } from '../crearConductor/nuevo-conductor-modal.component';
import { CoreService } from 'src/app/core/core.service';
import { AppointmentConductorComponent } from '../appointmentConductor/appointmentConductor.component';
import baselineAutorenew from '@iconify/icons-ic/baseline-autorenew';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

moment.locale('es');

@Component({
    selector: 'app-appointmentDetail',
    templateUrl: './appointmentDetail.component.html',
    styleUrls: ['./appointmentDetail.component.scss']
})
export class AppointmentDetailComponent implements OnInit, AfterViewInit, OnDestroy {

    // ─── Iconos ───────────────────────────────────────────────────────────────
    baselineAutorenew = baselineAutorenew;

    // ─── Estado de UI ────────────────────────────────────────────────────────
    sending = false;
    selected: any = null;
    showOnlyName = false;
    editing = false;
    loadingRecords = false;

    // ─── Imagen ───────────────────────────────────────────────────────────────
    previewImage: string | null = null;
    previewImageSafeUrl: SafeUrl;
    base64Image = '';
    tieneImagenGuardada = false;

    // ─── Datos de tablas ──────────────────────────────────────────────────────
    tableData: any[] = [];
    dataBloqueo: any[] = [];
    dataAppointment: any[] = [];
    items: any[] = [];

    // ─── Listas de entidades ──────────────────────────────────────────────────
    clientes: any[] = [];
    conductor: any[] = [];
    vendedor: any[] = [];
    producto: any[] = [];
    patients: any[] = [];

    /** @deprecated Renombrado a clientes. Se mantiene por compatibilidad de template. */
    protected cliente: any[] = [];

    // ─── FormControls de búsqueda ─────────────────────────────────────────────
    patientFilterCtrl: FormControl = new FormControl();
    patient1FilterCtrl: FormControl = new FormControl();
    conductorFilterCtrl: FormControl = new FormControl();
    vendedorFilterCtrl: FormControl = new FormControl();
    productoFilterCtrl: FormControl = new FormControl();

    // ─── Subjects filtrados ───────────────────────────────────────────────────
    filteredPatients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredclientes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredconductor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredvendedor: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredproducto: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    // ─── Formulario ───────────────────────────────────────────────────────────
    obs: FormGroup;

    // ─── Mapa ─────────────────────────────────────────────────────────────────
    googleMapsEmbedUrl: SafeResourceUrl;

    // ─── Sesión ───────────────────────────────────────────────────────────────
    usuario: any;
    role = '';

    protected readonly _onDestroy = new Subject<void>();

    // ─── Fecha de hoy cacheada (evita recalcular en cada getDias) ─────────────
    private readonly _hoy = moment().format('YYYY-MM-DD');

    // ─────────────────────────────────────────────────────────────────────────
    constructor(
        public dialogRef: MatDialogRef<AppointmentDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private coreService: CoreService,
        private sanitizer: DomSanitizer
    ) {
        // Sesión — idealmente mover a AuthService/CoreService
        const usuarioJSON = localStorage.getItem('current_user');
        this.usuario = JSON.parse(usuarioJSON);
        this.role = this.usuario?.role?.role ?? '';
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Lifecycle hooks
    // ═════════════════════════════════════════════════════════════════════════

    ngOnInit(): void {
        this._initImage();
        this.loadRecords();
        this.FormularioOrganizar();
        this._cargarTodasLasEntidades();
        this._suscribirFiltros();
    }

    ngAfterViewInit(): void { /* reservado para inicializaciones de vista */ }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Permisos
    // ═════════════════════════════════════════════════════════════════════════

    userPermisoCrear(): number {
        return this.coreService?.currentUser?.role?.permiso?.crear_pedido;
    }

    userPermisoStatus(): number {
        return this.coreService?.currentUser?.role?.permiso?.status;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Mapa
    // ═════════════════════════════════════════════════════════════════════════

    get googleMapsUrl(): string | null {
        const coords = this.data?.appointment?.coordenadas;
        if (!coords || coords === '' || coords === 'null' || coords === '0') {
            return null;
        }
        const [latStr, lngStr] = coords.split(',');
        const lat = parseFloat(latStr.trim());
        const lng = parseFloat(lngStr.trim());
        return `https://www.google.com/maps?q=${lat},${lng}`;
    }

    getSafeUrl(lat: number, lng: number): SafeResourceUrl {
        const url = `https://www.google.com/maps/embed/v1/view?key=TU_API_KEY&center=${lat},${lng}&zoom=16`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Imagen
    // ═════════════════════════════════════════════════════════════════════════

    setPreviewImage(base64Data: string): void {
        if (base64Data) {
            this.previewImageSafeUrl = this.sanitizer.bypassSecurityTrustUrl(base64Data);
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const result = reader.result as string;
            if (file.type.startsWith('image/')) {
                const compressed = await this.compressImage(result, 300, 300);
                this.previewImage = compressed;
                this.base64Image = compressed.split(',')[1];
            } else {
                this.previewImage = null;
                this.base64Image = result.split(',')[1];
            }
            this.tieneImagenGuardada = false;
            input.value = '';
        };
        reader.readAsDataURL(file);
    }

    compressImage(base64: string, maxWidth: number, maxHeight: number): Promise<string> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width *= scale;
                    height *= scale;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = base64;
        });
    }

    removeImage(): void {
        this.previewImage = null;
        this.base64Image = '';
        this.tieneImagenGuardada = false;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Formulario
    // ═════════════════════════════════════════════════════════════════════════

    FormularioOrganizar(): void {
        const esAdmin = this.role === 'Administrador';
        const esConsulta = this.role === 'consulta';
        const esProgramador = this.role === 'Programador';

        // Un campo está disabled si NO es admin Y NO tiene permiso por su rol específico
        const dis = (cond: boolean) => ({ value: '', disabled: cond });

        this.obs = new FormGroup({
            id: new FormControl(dis(!esAdmin)),
            date: new FormControl(dis(!esAdmin && !esProgramador), [Validators.required]),
            time: new FormControl(dis(!esAdmin && !esProgramador), [Validators.required]),
            end_time: new FormControl({ value: '-:-- --', disabled: !esAdmin && !esProgramador }),
            status: new FormControl(dis(esConsulta), [Validators.required]),
            cliente: new FormControl(dis(!esAdmin)),
            metros: new FormControl(dis(esConsulta && !esProgramador), [Validators.required]),
            type_concreto: new FormControl(dis(!esAdmin)),
            direccion: new FormControl(dis(!esAdmin), [Validators.required]),
            vendedor: new FormControl({ value: 'sin vendedor', disabled: !esAdmin }),
            conductor: new FormControl({ value: 'sin conductor', disabled: !esAdmin }),
            observaciones: new FormControl(dis(!esAdmin)),
            tipo_descarga: new FormControl(dis(!esAdmin)),
            dias_pago: new FormControl(dis(!esAdmin), [Validators.required]),
            coordenadas: new FormControl(dis(!esAdmin)),
            imagen: new FormControl(dis(!esAdmin)),
        });
        
        if (this.data?.appointment) {
            const ap = this.data.appointment;
            this.obs.setValue({
                id: ap.id ?? null,
                cliente: ap.cliente ?? null,
                date: ap.date ?? new Date(),
                metros: ap.metros ?? null,
                dias_pago: ap.fecha_pago ? this.getDias(ap.fecha_pago) : null,
                time: ap.time ?? null,
                type_concreto: ap.type_concreto ?? null,
                direccion: ap.direccion ?? null,
                end_time: ap.end_time ?? null,
                vendedor: ap.vendedor ?? null,
                conductor: ap.conductor ?? null,
                observaciones: ap.observaciones ?? null,
                tipo_descarga: ap.tipo_descarga != null ? ap.tipo_descarga.toString() : null,
                status: ap.status != null ? ap.status.toString() : null,
                coordenadas: ap.coordenadas ?? null,
                imagen: ap.imagen ?? null,
            });

            if (ap.id) {
                this.showOnlyName = true;
                this.editing = true;
            }
        } else {
            this.obs.controls.date.setValue(new Date());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Guardado
    // ═════════════════════════════════════════════════════════════════════════

    loadBloqueo(): void {
        this.loadingRecords = true;
        // FIX: getRawValue() para leer campos deshabilitados sin habilitar el form
        const data = this.obs.getRawValue();
        const queryParams = `date:"${moment(data.date).format('YYYY-MM-DD')}"`;
        const queryProps = 'id, id_usuario, fecha, nombreusuario';

        this.apiService.getBloqueo(queryParams, queryProps)
            .pipe(takeUntil(this._onDestroy))
            .subscribe({
                next: (response: any) => {
                    this.dataBloqueo = response.data.bloqueo;
                    this.loadingRecords = false;

                    if (this.dataBloqueo.length > 0) {
                        this.snackBar.open('Día cerrado', null, { duration: 4000 });
                    } else {
                        this.save();
                    }
                },
                error: (err) => {
                    this.loadingRecords = false;
                    this.snackBar.open('Error.', null, { duration: 4000 });
                    console.error('loadBloqueo error:', err);
                }
            });
    }

    save(): void {
        // FIX: getRawValue() lee los campos disabled sin necesidad de obs.enable()
        const data = this.obs.getRawValue();
        this.sending = true;

        const ap = this.data.appointment;
        const id = ap ? `id: ${data.id},` : '';

        // FIX: usar base64Image en lugar de previewImageSafeUrl (que es un objeto SafeUrl)
        const imagen = `imagen: "${this.base64Image || ''}",`;
        const patient_id = ap ? '' : `patient_id: ${data.cliente.id},`;
        const status = `status: ${data.status},`;
        const name = ap ? `name: "${ap.name}",` : `name: "${data.cliente.name}",`;
        const type_concreto = ap ? `type_concreto: "${ap.type_concreto}",` : `type_concreto:"${data.type_concreto.nombre}",`;
        const vendedor = ap ? `vendedor: "${ap.vendedor}",` : `vendedor: "${data.vendedor.name}",`;

        const metros = `metros: "${data.metros}",`;
        const date = `date: "${moment(data.date).format('YYYY-MM-DD')}",`;
        const fecha_pago = `fecha_pago: "${moment().add(data.dias_pago, 'days').format('YYYY-MM-DD')}",`;
        const time = `time: "${data.time}",`;
        const end_time = `end_time: "${data.end_time}",`;
        const direccion = `direccion: "${data.direccion}",`;
        const observaciones = `observaciones: "${data.observaciones}",`;
        const coordenadas = `coordenadas: "${data.coordenadas}",`;
        const tipo_descarga = `tipo_descarga: "${data.tipo_descarga}",`;

        const queryParams = `${id} ${name} ${fecha_pago} ${metros} ${type_concreto} ${date} ${time} ${end_time} ${patient_id} ${status} ${direccion} ${vendedor} ${observaciones} ${tipo_descarga} ${coordenadas} ${imagen}`;
        const queryProps = 'id, conductor, tipo_descarga, observaciones';

        this.apiService.createAppointmentCtz(queryParams, queryProps)
            .pipe(takeUntil(this._onDestroy))
            .subscribe({
                next: () => {
                    this.sending = false;
                    this.FormularioOrganizar();
                    this.snackBar.open('Guardado', null, { duration: 4000 });
                },
                error: (err) => {
                    this.sending = false;
                    this.snackBar.open('Cambia las comillas dobles por simples.', null, { duration: 4000 });
                    console.error('save error:', err);
                }
            });
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Carga de entidades — patrón unificado
    // ═════════════════════════════════════════════════════════════════════════

    loadRecords(): void {
        this.tableData.push(this.data.appointment);
    }

    loadPatients(callback?: () => void): void {
        this._loadEntidad(
            this.apiService.getPatients('status:""', 'id, name, phone, identity, created_at user{ id, email }'),
            'appPatient', this.patients, this.filteredPatients, callback
        );
    }

    loadclientes(callback?: () => void): void {
        this._loadEntidad(
            this.apiService.getClientes('search:""', 'id, name'),
            'cliente', this.clientes, this.filteredclientes, callback
        );
    }

    loadConductor(callback?: () => void): void {
        this._loadEntidad(
            this.apiService.getConductor('search:""', 'id, name, placa'),
            'conductor', this.conductor, this.filteredconductor, callback
        );
    }

    loadVendedor(callback?: () => void): void {
        this._loadEntidad(
            this.apiService.getVendedores('search:""', 'id, name'),
            'vendedores', this.vendedor, this.filteredvendedor, callback
        );
    }

    loadProducto(callback?: () => void): void {
        this._loadEntidad(
            this.apiService.getProducto('search:""', 'id, nombre'),
            'producto', this.producto, this.filteredproducto, callback
        );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Filtros de búsqueda — patrón unificado
    // ═════════════════════════════════════════════════════════════════════════

    getDias(fecha_pago: string): number {
        return moment(fecha_pago).diff(this._hoy, 'days');
    }

    protected filterPatients(): void { this._filtrar(this.patients, this.patient1FilterCtrl, this.filteredPatients, 'name'); }
    protected filterclientes(): void { this._filtrar(this.clientes, this.patientFilterCtrl, this.filteredclientes, 'name'); }
    protected filterConductor(): void { this._filtrar(this.conductor, this.conductorFilterCtrl, this.filteredconductor, 'name'); }
    protected filterVendedor(): void { this._filtrar(this.vendedor, this.vendedorFilterCtrl, this.filteredvendedor, 'name'); }  // FIX: usa vendedorFilterCtrl
    protected filterProducto(): void { this._filtrar(this.producto, this.productoFilterCtrl, this.filteredproducto, 'nombre'); }

    // ═════════════════════════════════════════════════════════════════════════
    // Modales — apertura
    // ═════════════════════════════════════════════════════════════════════════

    openNewPatient(): void {
        this._openDialog(PatientFormModalComponent, {}, (result) => {
            this.loadPatients(() => this._selectEnLista(this.patients, result.id, 'vendedor'));
        });
    }

    openUserAddModal(): void {
        this._openDialog(UserAddModalComponent, { width: '500px', height: '600px', maxHeight: '700px' }, (result) => {
            this.loadclientes(() => this._selectEnLista(this.clientes, result.id, 'cliente'));
        });
    }

    openNewProductot(): void {
        this._openDialog(CrearProductoComponent, {}, (result) => {
            this.loadProducto(() => this._selectEnLista(this.producto, result.id, 'type_concreto'));
        });
    }

    crearConductor(appointment: any = null): void {
        this._openDialog(NuevoConductorComponent, { data: { appointment } }, (result) => {
            this.loadConductor(() => this._selectEnLista(this.conductor, result.id, 'conductor'));
        });
    }

    crearVendedor(appointment: any = null): void {
        this._openDialog(NuevoVendedorComponent, { data: { appointment } }, (result) => {
            this.loadVendedor(() => this._selectEnLista(this.vendedor, result.id, 'vendedor'));
        });
    }

    selectNewPatient(appointment: any = null): void {
        this._openDialog(ClienteModalComponent, { data: { appointment } }, (result) => {
            this.loadclientes(() => this._selectEnLista(this.clientes, result.id, 'cliente'));
        });
    }

    selectNewConductor(appointment: any = null): void {
        this._openDialog(AppointmentConductorComponent, { data: { appointment } }, () => this.close(true));
    }

    selectNewProducto(appointment: any = null): void {
        this._openDialog(CambiarProductoModalComponent, { data: { appointment } }, () => this.close(true));
    }

    selectNewVendedor(appointment: any = null): void {
        this._openDialog(VendedorModalComponent, { data: { appointment } }, () => this.close(true));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Cierre del diálogo
    // ═════════════════════════════════════════════════════════════════════════

    close(params: any = null): void {
        this.dialogRef.close(params);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Métodos privados de utilidad
    // ═════════════════════════════════════════════════════════════════════════

    /** Inicializa la imagen guardada al abrir el modal */
    private _initImage(): void {
        const imagenGuardada = this.data?.appointment?.imagen;
        this.setPreviewImage(imagenGuardada);
        if (imagenGuardada) {
            this.previewImage = 'data:image/jpeg;base64,' + imagenGuardada;
            this.base64Image = imagenGuardada;
            this.tieneImagenGuardada = true;
        }
    }

    /** Carga todas las listas necesarias al iniciar */
    private _cargarTodasLasEntidades(): void {
        this.loadPatients();
        this.loadclientes();
        this.loadConductor();
        this.loadVendedor();
        this.loadProducto();
    }

    /**
     * Patrón unificado para cargar entidades desde la API.
     * FIX: agrega takeUntil para evitar memory leaks
     */
    private _loadEntidad<T>(
        observable: Observable<any>,
        dataKey: string,
        targetArray: T[],
        subject: ReplaySubject<T[]>,
        callback?: () => void
    ): void {
        observable.pipe(takeUntil(this._onDestroy)).subscribe({
            next: (response: any) => {
                const items = response.data[dataKey] as T[];
                targetArray.splice(0, targetArray.length, ...items);
                subject.next(items.slice());
                callback?.();
            },
            error: (err) => console.error(`Error cargando ${dataKey}:`, err)
        });
    }

    /** Patrón unificado para filtrar listas por campo de texto */
    private _filtrar<T>(
        lista: T[],
        ctrl: FormControl,
        subject: ReplaySubject<T[]>,
        campo: keyof T
    ): void {
        if (!lista?.length) return;
        const search = (ctrl.value ?? '').toLowerCase();
        subject.next(
            search
                ? lista.filter(item => (item[campo] as any).toLowerCase().includes(search))
                : lista.slice()
        );
    }

    /** Patrón unificado para abrir un diálogo y ejecutar acción si hay resultado */
    private _openDialog(
        component: any,
        config: object,
        onResult?: (result: any) => void
    ): void {
        const defaults = { width: '500px', height: 'auto', maxHeight: '800px' };
        const dialogRef = this.dialog.open(component, { ...defaults, ...config });
        dialogRef.afterClosed().subscribe(result => {
            if (result && onResult) onResult(result);
        });
    }

    /** Busca un elemento por id en una lista y lo asigna al control indicado */
    private _selectEnLista(lista: any[], id: any, controlName: string): void {
        const match = lista.find(item => item.id === id);
        if (match) {
            this.obs.controls[controlName]?.setValue(match);
        }
    }

    /** Suscribe todos los filtros de búsqueda a sus FormControls */
    private _suscribirFiltros(): void {
        const suscribir = (ctrl: FormControl, fn: () => void) =>
            ctrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(fn.bind(this));

        suscribir(this.patient1FilterCtrl, this.filterPatients);
        suscribir(this.patientFilterCtrl, this.filterclientes);
        suscribir(this.conductorFilterCtrl, this.filterConductor);
        suscribir(this.vendedorFilterCtrl, this.filterVendedor);   // FIX: era filterConductor
        suscribir(this.productoFilterCtrl, this.filterProducto);   // FIX: era filterConductor
    }
}