import {Pipe, PipeTransform} from '@angular/core';
import {trimTags} from '@mod/core/utils/trimTags';

@Pipe({
  name: 'truncateTags'
})
export class TruncateTagsPipe implements PipeTransform {
  transform(value: string): string {
    return trimTags(value);
  }
}
