import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {boldSelection, insertImage, insertLink, insertTab, insertText, italicizeSelection, parseKeyboardShortcut} from './utils';
import {ClipboardObject, ClipboardObjectType} from './models/ClipboardObject';

@Component({
  selector: 'md-editor',
  templateUrl: './md-editor.component.html',
  styles: [`
    .rt-editor-input {
      white-space: pre-wrap;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MdEditorComponent),
    multi: true
  }]
})
export class MdEditorComponent implements AfterViewInit, ControlValueAccessor {

  value$: Subject<string> = new Subject<string>();

  @ViewChild('editable', {static: false})
  private readonly editor!: ElementRef<HTMLDivElement>;

  @Output()
  idle: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  keyboardShortcut: EventEmitter<ShortcutEvent> = new EventEmitter<ShortcutEvent>();

  onChange: (_: any) => void = (_: any) => {};
  onTouched: () => void = () => {};

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  writeValue(obj: string): void {
    const stringVal = obj || '';
    this.value$.next(obj || '');
    this.updateChanges(stringVal);
  }

  updateChanges(val = null) {
    if (this.editor === undefined) {
      this.onChange(val);
    } else {
      this.onChange(this.editor.nativeElement.innerHTML);
    }
  }

  ngAfterViewInit() {
    this.setFirstValue();
    this.listenForIdleness();
    this.setCaretPosition();
  }

  setCaretPosition(atStart = false) {
    const el = this.editor.nativeElement;

    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(atStart);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  async handlePaste(ev: ClipboardEvent) {
    ev.preventDefault();
    const clipboardObj = new ClipboardObject(ev);

    switch (clipboardObj.type) {
      case ClipboardObjectType.IMAGE:
        await insertImage(ev);
        break;
      case ClipboardObjectType.LINK:
        await insertLink(ev);
        break;
      case ClipboardObjectType.TEXT:
        await insertText(ev);
        break;
    }

    this.setCaretPosition();
  }

  handleFocus(ev: FocusEvent) {
    this.setCaretPosition();
  }

  handleKeydown(ev: KeyboardEvent) {
    const shortcut = parseKeyboardShortcut(ev);

    switch (shortcut) {
      case 'ctrl+b':
        document.execCommand('bold');
        break;
      case 'ctrl+i':
        document.execCommand('italic');
        break;
      case 'tab':
        ev.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;');
        break;
    }

    if (ev.ctrlKey) {
      this.emitKeyboardShortcut(ev);
    }
  }

  private emitKeyboardShortcut(ev: KeyboardEvent) {
    this.keyboardShortcut.emit({
      event: ev,
      shortcut: parseKeyboardShortcut(ev)
    });
  }

  private listenForIdleness() {
    fromEvent(this.editor.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.idle.emit();
      });
  }

  private setFirstValue() {
    this.value$.asObservable()
      .subscribe(val => {
        this.editor.nativeElement.innerHTML = val.toString();
        this.setCaretPosition();
      });
  }
}

export interface ShortcutEvent {
  shortcut: string;
  event: Event;
}
