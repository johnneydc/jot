import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Jot} from '../../model/jot';

@Component({
  selector: 'jot-editor',
  templateUrl: './jot-editor.component.html'
})
export class JotEditorComponent {

  @Input()
  jot: Jot;

  @Input()
  saved: boolean;

  @Output()
  idle: EventEmitter<void> = new EventEmitter<void>();

  hasBeenIdle() {
    this.idle.emit();
  }
}
