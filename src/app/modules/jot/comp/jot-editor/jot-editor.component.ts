import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Jot} from '@mod/jot/model/jot';
import {Command} from '@mod/jot/shared/command';
import {MdEditorComponent, ShortcutEvent} from '@mod/md-editor/component/md-editor.component';
import {ToastService} from '@mod/toast/toast.service';

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
  command: EventEmitter<CommandEvent> = new EventEmitter<CommandEvent>();

  @ViewChild('editor', { static: true })
  private readonly editor!: MdEditorComponent;

  constructor(
    private readonly toastService: ToastService
  ) { }

  hasBeenIdle() {
    this.idle.emit();
  }

  toggleTemporary() {
    this.isTemporary = !this.isTemporary;
    this.isTemporaryToggled.emit(this.isTemporary);
    this.toastService.show(`Auto-saving toggled ${this.isTemporary ? 'off' : 'on'}.`);
  }

  processShortcut({shortcut, event}: ShortcutEvent) {
    switch (shortcut) {
      case 'ctrl+shift+k':
        this.command.emit({
          command: Command.OPEN_RECENT, event
        });
        break;
      case 'ctrl+j':
        this.command.emit({
          command: Command.NEW_JOT, event
        });
        break;
      case 'ctrl+shift+j':
        this.command.emit({
          command: Command.NEW_TEMPORARY_JOT, event
        });
        break;
      case 'ctrl+s':
        this.command.emit({
          command: Command.SAVE_CURRENT, event
        });
        break;
    }
  }

  focus() {
    this.editor.setCaretPosition();
  }
}

export interface CommandEvent {
  command: Command;
  event: Event;
}
