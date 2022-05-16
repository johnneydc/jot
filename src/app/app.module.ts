import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ReactiveFormsModule} from '@angular/forms';
import {JotModule} from '@mod/jot/jot.module';
import {CoreModule} from '@mod/core/core.module';
import {IdbService} from '@mod/core/services/idb.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastModule} from '@mod/toast/toast.module';

export function initApp(idbService: IdbService) {
  return (): Promise<any> => {
    return idbService.initialize();
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),

        JotModule,
        CoreModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ToastModule
    ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [IdbService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
