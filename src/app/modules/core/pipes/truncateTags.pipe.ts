import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncateTags'
})
export class TruncateTagsPipe implements PipeTransform {
  transform(value: string): string {
    const span = document.createElement('span');
    span.innerHTML = value;
    return span.textContent || span.innerText;
  }
}
