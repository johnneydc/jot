import {NgModule} from '@angular/core';
import {IdbService} from './services/idb.service';
import {RelativeTimePipe} from './pipes/relativeTime.pipe';

@NgModule({
  providers: [IdbService],
  declarations: [RelativeTimePipe],
  exports: [RelativeTimePipe]
})
export class CoreModule { }
