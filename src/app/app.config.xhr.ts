import { provideHttpClient, withXhr } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { HTTP_TRANSPORT_LABEL } from './http-transport.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withXhr()),
    {
      provide: HTTP_TRANSPORT_LABEL,
      useValue: 'HttpXhrBackend (withXhr())',
    },
  ],
};
