import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { AuthenticationService } from './authentication/authentication.service';
import { CredentialsService } from './authentication/credentials.service';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { HttpService } from './http/http.service';
import { HttpCacheService } from './http/http-cache.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { JwtInterceptor } from './http/jwt.interceptor';
import { ApiService } from './api/api.service';
import { CoreService } from './core.service';
import { PaginacionPipe } from './pipes/paginacion.pipe';
// import { RecordsService } from '@app/pages/records/records.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [
    AuthenticationService,
    CredentialsService,
    AuthenticationGuard,
    ApiService,
    // RecordsService,
    CoreService,
    HttpCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    JwtInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ],
  declarations: [PaginacionPipe]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
