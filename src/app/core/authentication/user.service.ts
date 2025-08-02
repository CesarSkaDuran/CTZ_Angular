import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from './authentication.service';
import { CoreService } from '../core.service';
import { SplashScreenService } from 'src/@vex/services/splash-screen.service';
import { Router } from '@angular/router';
import { GraphQLQueryContext } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    loaded= false;
    constructor(private http: HttpClient,
         private authenticationService: AuthenticationService,
        private coreService: CoreService,
        private splashScreen: SplashScreenService,
        private router: Router
         ) { }

    getAll() {
        return (context: GraphQLQueryContext) =>
            `/graphql/secret?query=query{me${context.params && context.params !== '' ? '(' + context.params + ')' : ''}{${
            context.properties
            }}}`
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.serverUrl}/users/${id}`);
    }
}