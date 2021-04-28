import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, first} from 'rxjs/operators';
import {toBase64} from '../../core/utils/base64';
import {isValidHttpUrl} from '../../core/utils/isUrl';
import {
  boldSelection,
  canBeAnImage,
  canBeAUrl,
  insertImage,
  insertLink,
  insertTab,
  insertText,
  italicizeSelection,
  parseKeyboardShortcut
} from './utils';
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
  keyboardShortcut: EventEmitter<string> = new EventEmitter<string>();

  private readonly nativeEditorShortcuts: Map<string, (ev: KeyboardEvent) => void> = new Map<string, () => void>();

  onChange: (_: any) => void = (_: any) => {};
  onTouched: () => void = () => {};

  constructor() {
    this.nativeEditorShortcuts.set('ctrl+b', boldSelection);
    this.nativeEditorShortcuts.set('ctrl+i', italicizeSelection);
    this.nativeEditorShortcuts.set('tab', insertTab);
  }

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

    if (this.nativeEditorShortcuts.has(shortcut)) {
      this.nativeEditorShortcuts.get(shortcut).apply(ev);
    }

    if (ev.ctrlKey) {
      this.emitKeyboardShortcut(ev);
    }
  }

  private emitKeyboardShortcut(ev: KeyboardEvent) {
    this.keyboardShortcut.emit(parseKeyboardShortcut(ev));
  }

  private listenForIdleness() {
    fromEvent(this.editor.nativeElement, 'keyup')
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
