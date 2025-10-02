import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  ...appConfig,
  providers: [...appConfig.providers, importProvidersFrom(HttpClientModule)],
}).catch((err) => console.error(err));
