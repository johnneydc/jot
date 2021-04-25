import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ReactiveFormsModule} from '@angular/forms';
import {JotModule} from './modules/jot/jot.module';
import {CoreModule} from './modules/core/core.module';
import {IdbService} from './modules/core/services/idb.service';

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
    ReactiveFormsModule
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
