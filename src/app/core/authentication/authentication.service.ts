import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';

const routes = {
  login: () => `/v1/auth/login`,
  register: () => `/v1/auth/register`,
  me: (context: GraphQLQueryContext) =>
    `/graphql/secret?query=query{me${context.params && context.params !== '' ? '(' + context.params + ')' : ''}{${
      context.properties
    }}}`
};

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterContext {
  name: string;
  email: string;
  password: string;
}

export interface GraphQLQueryContext {
  params: string;
  properties: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    return this.httpClient.post(routes.login(), context, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }).pipe(
      switchMap((response: any) => {
        const data = response;
        this.credentialsService.setCredentials(data, context.remember);

        return of(data);
      }),
      catchError(error => {
        throw new Error('cannot login user');
      })
    );
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  register(context: RegisterContext): Observable<Credentials> {
    return this.httpClient.post(routes.register(), context).pipe(
      switchMap((response: any) => {
        const data = response;
        this.credentialsService.setCredentials(data, true);

        return of(data);
      }),
      catchError(error => {
        if (error.status === 403) {
          throw new Error('Email already used');
        }

        if (error.status === 500) {
          throw new Error('Error, try again');
        }

        throw new Error(error.statusText);
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  /**
   * Checks if the current user sesion is valid
   * @return True if user token is still valid
   */
  checkUser(properties: string, params: string = ''): Observable<Object> {
    return this.httpClient.get(routes.me({ params: params, properties: properties }));
  }
}
