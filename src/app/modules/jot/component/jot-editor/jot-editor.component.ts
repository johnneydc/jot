import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Jot} from '../../model/jot';
import {Command} from '../../shared/command';

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

  @Output()
  isTemporaryToggled: EventEmitter<boolean> = new EventEmitter<boolean>();
  isTemporary = false;

  @Output()
  command: EventEmitter<Command> = new EventEmitter<Command>();

  hasBeenIdle() {
    this.idle.emit();
  }

  toggleTemporary() {
    this.isTemporary = !this.isTemporary;
    this.isTemporaryToggled.emit(this.isTemporary);
  }

  processShortcut($event: string) {
    if ($event === 'ctrl+shift+k') {
      this.command.emit(Command.OPEN_RECENT);
    }
  }
}
