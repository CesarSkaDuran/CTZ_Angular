import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, tap } from 'rxjs/operators';
import ApiHelpers from './api-helpers';
import { Patient } from 'src/app/models/patient';
import { Record } from 'src/app/models/record';
import { environment } from 'src/environments/environment';

const prefix = '/graphql';

const routes = {
  recordsPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{recordsPagination(${context.params}){${context.properties}}}`,
  patients: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appPatient(${context.params}){${context.properties}}}`,
  bloqueo: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{bloqueo(${context.params}){${context.properties}}}`,
  credito: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{credito(${context.params}){${context.properties}}}`,
  banco: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{banco(${context.params}){${context.properties}}}`,
  pedido: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{pedido(${context.params}){${context.properties}}}`,
  panelCliente: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{panelCliente(${context.params}){${context.properties}}}`,
  detallePago: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{detallePago(${context.params}){${context.properties}}}`,
  patients2: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{patients(${context.params}){${context.properties}}}`,
  role: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{role(${context.params}){${context.properties}}}`,
  cliente: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{cliente(${context.params}){${context.properties}}}`,
  producto: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{producto(${context.params}){${context.properties}}}`,
  conductor: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{conductor(${context.params}){${context.properties}}}`,
  user: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{user(${context.params}){${context.properties}}}`,
  color: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{color{${context.properties}}}`,
  vendedores: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{vendedores{${context.properties}}}`,
  savePatient: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveAppPatient(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getRecord: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{record(${context.params}){${context.properties}}}`,
  getBloqueo: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{bloqueo(${context.params}){${context.properties}}}`,
  getCredito: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{credito(${context.params}){${context.properties}}}`,
  getBanco: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{banco(${context.params}){${context.properties}}}`,
  getDetallePago: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{detallePago(${context.params}){${context.properties}}}`,
  getMultimedias: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{multimedias(${context.params}){${context.properties}}}`,
  saveRecord: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveRecord(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  makeRecord: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{makeRecord(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  savePhysical: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePhysical(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  savePregnancy: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePregnancy(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveBloqueo: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveBloqueo(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCitology: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCitology(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveControl: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveControl(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  getControls: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{controls(${context.params}){${context.properties}}}`,
  saveLaboratory: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveLaboratory(${context.params}){${context.properties}}}`,
  saveLabor: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveLabor(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveBirth: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveBirth(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveConclusion: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveConclusion(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCoomb: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCoomb(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCredito: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCredito(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveHto: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveHto(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveHb: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveHb(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveCit: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveCit(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveVaccine: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveVaccine(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveEvolution: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveEvolution(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveObs: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveObs(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  savePopq: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{savePopq(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveUser: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveUser(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  saveDetallePago: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveDetallePago(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  clienteFoto: () => `/v1/actions/clienteFoto`,
  usuarioFoto: () => `/v1/actions/usuarioFoto`,
  conductorFoto: () => `/v1/actions/conductorFoto`,
  patientProfile: () => `/v1/actions/patientProfile`,
  recordImage: () => `/v1/actions/recordMultimedia`,
  estadisticas: () => `/v1/actions/estadisticas`,
  appointmentMonth: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointmentMonth(${context.params}){${context.properties}}}`,
  incomesPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{incomesPagination(${context.params}){${context.properties}}}`,
  saveIncome: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveIncome(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  deleteAppointment: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{deleteAppointment(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  appointmentsPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointmentsPagination(${context.params}){${context.properties}}}`,
  appointmentsAllPagination: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointmentsAllPagination(${context.params}){${context.properties}}}`,
  appointments: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointments(${context.params}){${context.properties}}}`,
  appointmentAll: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{appointmentAll(${context.params}){${context.properties}}}`,
  saveAppointment: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveAppointment(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createAppointment: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createDoctorAppointment(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createCliente: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createCliente(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createProducto: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createProducto(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createAppointmentCtz: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createAppointmentCtz(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createVendedor: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createVendedor(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  createConductor: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{createConductor(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
  patientCreationData: (context: GraphQLQueryContext) => `${prefix}/secret?query=query{patientCreationData(${context.params}){${context.properties}}}`,
  saveMultimedia: (context: GraphQLQueryContext) => `${prefix}/secret?query=mutation{saveMultimedia(${encodeURIComponent(context.params).replace(/%0A/g, '<br>')}){${context.properties}}}`,
};

export interface GraphQLQueryContext {
  params: string;
  properties: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class ApiService {
  dashboardData: any = null;
  apiHelpers: ApiHelpers;
  currentCompany: any;
  currentPatient: any;
  currentRecord: any;

  private companySelected = new Subject<any>();
  companySelected$ = this.companySelected.asObservable();

  constructor(private httpClient: HttpClient) {
    this.apiHelpers = new ApiHelpers();
  }

  makeQuery(routeFunction: any, params: string, properties: string) {
    return this.httpClient.get(routeFunction({params: params, properties: properties})).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  selectCompany(company: any) {
    this.currentCompany = company;
    this.companySelected.next(company);
  }

  public setPatient(patient: Patient) {
    this.currentPatient = patient;

    this.currentPatientWasSelected(patient);
  }

  public setRecord(record: Record) {
    this.currentRecord = record;

    if (record) {
      this.setPatient(record.patient);
      this.cacheCurrentRecord(record.patient);
      this.cacheLastRecord(record);
    } else {
      this.setPatient(null);
      this.deleteCurrentRecordFormCache();
    }
  }

  private currentPatientWasSelected(currentPatient: Patient) {
    console.log('next');
    this.currentPatient = currentPatient;
    this.companySelected.next(currentPatient);
  }

  private cacheCurrentRecord(patient: Patient) {
    localStorage.setItem('currentRecord', JSON.stringify(patient));
  }

  private cacheLastRecord(record: Record) {
    localStorage.setItem('lastRecord', JSON.stringify(record));
  }

  private deleteCurrentRecordFormCache() {
    localStorage.removeItem('currentRecord');
  }

  getCurrentRecordFromCache() {
    return JSON.parse(localStorage.getItem('currentRecord'));
  }

  getLastRecordFromCache() {
    return JSON.parse(localStorage.getItem('lastRecord'));
  }

  //
  //

  getRecordsPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.recordsPagination, params, properties);
  }

  
  getCredito(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.credito, params, properties);
  }

  getPanelCliente(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.panelCliente, params, properties);
  }

  getRecord(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getRecord, params, properties);
  }

  getBloqueo(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.bloqueo, params, properties);
  }

  
  getBanco(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.banco, params, properties);
  }

  getDetallePago(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.detallePago, params, properties);
  }


  getUser(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.user, params, properties);
  }

  getRole(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.role, params, properties);
  }

  getPatients(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.patients, params, properties);
  }

  getPatients2(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.patients2, params, properties);
  }

  getColor(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.color, params, properties);
  }
  getVendedores(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.vendedores, params, properties);
  }
  getClientes(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.cliente, params, properties);
  }
  getProducto(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.producto, params, properties);
  }


  getConductor(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.conductor, params, properties);
  }

  savePatient(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePatient, params, properties);
  }

  saveRecord(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveRecord, params, properties);
  }

  makeRecord(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.makeRecord, params, properties);
  }

  savePhysical(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePhysical, params, properties);
  }

  saveBloqueo(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveBloqueo, params, properties);
  }

  savePregnancy(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePregnancy, params, properties);
  }

  saveUser(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveUser, params, properties);
  }

  saveCredito(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCredito, params, properties);
  }


  saveDetallePago(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveDetallePago, params, properties);
  }

  saveCitology(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCitology, params, properties);
  }

  saveControl(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveControl, params, properties);
  }

  getControls(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.getControls, params, properties);
  }

  saveLaboratory(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveLaboratory, params, properties);
  }

  saveLabor(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveLabor, params, properties);
  }

  saveBirth(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveBirth, params, properties);
  }

  saveConclusion(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveConclusion, params, properties);
  }

  saveCoomb(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCoomb, params, properties);
  }

  saveHto(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveHto, params, properties);
  }

  saveHb(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveHb, params, properties);
  }

  saveCit(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveCit, params, properties);
  }

  saveVaccine(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveVaccine, params, properties);
  }

  saveEvolution(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveEvolution, params, properties);
  }

  saveObs(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveObs, params, properties);
  }

  savePopq(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.savePopq, params, properties);
  }
  getPatientCreationData(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.patientCreationData, params, properties);
  }

  savePatientProfileImage(file: any, $patientId: string) {
    const formData = new FormData();

    formData.append('image', file, "imagenejemplo.jpg");
    formData.append('user_id', $patientId);

    return this.httpClient.post(routes.usuarioFoto(), formData).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }






  saveConductorProfileImage(file: any, $conductorId: string) {
    const formData = new FormData();

    formData.append('image', file, "imagenejemplo.jpg");
    formData.append('conductor_id', $conductorId);

    return this.httpClient.post(routes.conductorFoto(), formData).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }


  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age':'3600',
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Headers':'authorization, content-type, xsrf-token',
      'Access-Control-Expose-Headers':'xsrf-token',
      'Access-Control-Allow-Origin':'*',
      'Authorization':'Bearer '+localStorage.getItem('accessToken'),
      //'Content-Type': 'application/json'
    })
  };


  /*
  public getEstadisticas(): Observable<any>{
    return this.httpClient.get(`${environment.serverUrl}/v1/actions/estadisticas`, this.httpOptions);

    return this.httpClient.get(`${environment.serverUrl}/v1/actions/estadisticas`).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }*/


  

  getEstadisticas() {
    //const formData = new FormData();

    //formData.append('image', file, "imagenejemplo.jpg");
    //formData.append('cliente_id', $clienteId);

    return this.httpClient.get(routes.estadisticas()).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }



  saveClienteProfileImage(file: any, $clienteId: string) {
    const formData = new FormData();

    formData.append('image', file, "imagenejemplo.jpg");
    formData.append('cliente_id', $clienteId);

    return this.httpClient.post(routes.clienteFoto(), formData).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }
  










  

  saveRecordImage(file: any, $recordId: string) {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('record_id', $recordId);

    return this.httpClient.post(routes.recordImage(), formData).pipe(
      switchMap((response: any) => {
        const data = response;

        return of(data);
      }),
      catchError(error => {
        throw new Error('Error');
      })
    );
  }

  getIncomes(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.incomesPagination, params, properties);
  }

  getPedido(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.pedido, params, properties);
  }

  saveIncome(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveIncome, params, properties);
  }

  

  deleteAppointment(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.deleteAppointment, params, properties);
  }

  getAppointments(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointments, params, properties);
  }
  getAppointmentAll(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentAll, params, properties);
  }
  getAppointmentPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentsPagination, params, properties);
  }
  getAppointmentAllPagination(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentsAllPagination, params, properties);
  }
  getAppointmentMonth(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.appointmentMonth, params, properties);
  }
  saveAppointment(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveAppointment, params, properties);
  }

  createAppointment(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createAppointment, params, properties);
  }
  createCliente(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createCliente, params, properties);
  }
  createVendedor(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createVendedor, params, properties);
  }
  createConductor(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createConductor, params, properties);
  }
  createProducto(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createProducto, params, properties);
  }
  createAppointmentCtz(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.createAppointmentCtz, params, properties);
  }
  saveMultimedia(params: string, properties: string): Observable<object> {
    return this.makeQuery(routes.saveMultimedia, params, properties);
  }

  getRecordFromLocal(params: string, properties: string): Observable<object> {
    return this.httpClient.get('http://localhost/hc_server/public' + routes.getRecord({ params: params, properties: properties })).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  getMultimediasFromLocal(params: string, properties: string): Observable<object> {
    return this.httpClient.get('http://localhost/hc_server/public' + routes.getMultimedias({ params: params, properties: properties })).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }

  saveLocalMultimedia(params: string, properties: string): Observable<object> {
    return this.httpClient.get('http://localhost/hc_server/public' + routes.saveMultimedia({ params: params, properties: properties })).pipe(
      tap(responseJson => this.apiHelpers.handleQueryError(responseJson)),
      catchError(errorResponse => {
        throw new Error(errorResponse);
      })
    );
  }
}
