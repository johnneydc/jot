import {Pipe, PipeTransform} from '@angular/core';
import * as DayJs from 'dayjs';
import * as relative from 'dayjs/plugin/relativeTime';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  constructor() {
    DayJs.extend(relative);
  }

  transform(value: Date): string {
    return DayJs(value).fromNow();
  }
}
