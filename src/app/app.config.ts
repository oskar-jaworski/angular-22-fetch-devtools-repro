import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { HTTP_TRANSPORT_LABEL } from './http-transport.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    {
      provide: HTTP_TRANSPORT_LABEL,
      useValue: 'FetchBackend (Angular 22 default)',
    },
  ],
};
