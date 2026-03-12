import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';
=======
>>>>>>> 4214f377706eea95b5484c5254e5ad8aeed07925

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
<<<<<<< HEAD
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient()
=======
    provideRouter(routes), provideClientHydration(withEventReplay())
>>>>>>> 4214f377706eea95b5484c5254e5ad8aeed07925
  ]
};
