import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
<<<<<<< HEAD
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {BsModalService} from "ngx-bootstrap/modal"

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(), provideAnimationsAsync(), BsModalService]
=======

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient()]
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
};
