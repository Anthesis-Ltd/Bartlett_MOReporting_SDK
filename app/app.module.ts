
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Log } from '@infor-up/m3-odin';
import { M3OdinModule } from '@infor-up/m3-odin-angular';
import { SohoComponentsModule } from 'ids-enterprise-ng'; // TODO Consider only importing individual SoHo modules in production
import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';
import { HomepagesComponent } from './homepages/homepages.component';
import { BanoLookupComponent } from './bano-lookup/bano-lookup.component';
import { MfnoLookupComponent } from './mfno-lookup/mfno-lookup.component';
import { WhslLookupComponent } from './whsl-lookup/whsl-lookup.component';


const appRoutes: Routes = [
   { path: '', component: ReportComponent },


];

@NgModule({
   declarations: [
      AppComponent,

      ReportComponent,
          HomepagesComponent,
          BanoLookupComponent,
          MfnoLookupComponent,
          WhslLookupComponent,


   ],
   imports: [
      BrowserModule,
      FormsModule,
      SohoComponentsModule,
      M3OdinModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterModule.forRoot(
         appRoutes,
         { enableTracing: true }
      )
   ],
   providers: [
      {
         provide: LOCALE_ID,
         useValue: 'en-US',
      },
      {
         provide: APP_INITIALIZER,
         multi: true,
         useFactory: (locale: string) => () => {
            Soho.Locale.culturesPath = 'assets/ids-enterprise/js/cultures/';
            return Soho.Locale.set(locale).catch(err => {
               Log.error('Failed to set IDS locale', err);
            });
         },
         deps: [LOCALE_ID],
      }
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
