import { enableProdMode } from '@angular/core';
import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';


if (environment.production) {
  enableProdMode();
}

// platformBrowser().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

  bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
