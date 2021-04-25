import {Component, Input} from '@angular/core';
import {Jot} from './models/jot';

@Component({
  selector: 'jot-editor',
  templateUrl: './jot-editor.component.html'
})
export class JotEditorComponent {

  @Input()
  jot: Jot;

}
