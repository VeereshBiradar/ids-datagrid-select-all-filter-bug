import { enableProdMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { SohoLocaleModule, SohoButtonModule, SohoComponentsModule } from 'ids-enterprise-ng';
import { SohoLocaleInitializerModule } from './app/locale/soho-locale-initializer.module';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, SohoLocaleModule, SohoButtonModule, SohoLocaleInitializerModule, SohoComponentsModule),
        {
            provide: LOCALE_ID,
            useValue: 'en-US'
        }
    ]
})
  .catch(err => console.error(err));
