import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { Patient } from 'src/app/models/patient';
import { Record } from 'src/app/models/record';
import { CredentialsService } from 'src/app/core';

export interface GraphQLQueryContext {
  params: string;
  properties: string;
}

const routes = {
  getRecords: (context: GraphQLQueryContext) =>
    `/graphql/secret?query=query{getRecords(${context.params}){${context.properties}}}`,
  getPatients: (context: GraphQLQueryContext) =>
    `/graphql/secret?query=query{getPatients(${context.params}){${context.properties}}}`,
  saveRecord: (context: GraphQLQueryContext) =>
    `/graphql/secret?query=query{saveRecord(${context.params}){${context.properties}}}`
};

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class RecordsService {
  currentPatient: Patient;
  currentRecord: Record;

  private currentPatientSelected = new Subject<any>();
  currentPatientSelected$ = this.currentPatientSelected.asObservable();

  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

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
    this.currentPatientSelected.next(currentPatient);
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
}
