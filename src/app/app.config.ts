import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {LoginInterceptorService} from './shared/login-interceptor.service';
import { TokenInterceptorService } from './shared/token-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(withFetch(),withInterceptorsFromDi()),
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptorService,
      multi:true
    },
    // {
    //   provide:HTTP_INTERCEPTORS,
    //   useClass:LoginInterceptorService,
    //   multi:true
    // }
  ]
};
