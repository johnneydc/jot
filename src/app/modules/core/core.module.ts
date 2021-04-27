import {NgModule} from '@angular/core';
import {IdbService} from './services/idb.service';
import {RelativeTimePipe} from './pipes/relativeTime.pipe';
import {TruncateTagsPipe} from './pipes/truncateTags.pipe';

@NgModule({
  providers: [IdbService],
  declarations: [RelativeTimePipe, TruncateTagsPipe],
  exports: [RelativeTimePipe, TruncateTagsPipe]
})
export class CoreModule { }
