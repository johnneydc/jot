import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, first} from 'rxjs/operators';
import {toBase64} from '../../core/utils/base64';
import {isValidHttpUrl} from '../../core/utils/isUrl';

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

  @ViewChild('editable', {static: false})
  private readonly editor!: ElementRef<HTMLDivElement>;

  @Output()
  idle: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  keyboardShortcut: EventEmitter<string> = new EventEmitter<string>();

  value$: Subject<string> = new Subject<string>();

  static canBeAnImage(clipboardData: DataTransfer) {
    return (clipboardData.types.includes('Files') && clipboardData.types.includes('text/html'))
      || (clipboardData.types.includes('Files') && clipboardData.files.item(0).type === 'image/png');
  }

  onChange: (_: any) => void = (_: any) => {};
  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

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
    this.value$.asObservable()
      .subscribe(val => {
        this.editor.nativeElement.innerHTML = val.toString();
        this.setCaretPosition();
      });

    this.editor.nativeElement.addEventListener('paste', async ev => {
      if (!MdEditorComponent.canBeAnImage(ev.clipboardData)) {
        ev.preventDefault();
        let text = ev.clipboardData.getData('text/plain');

        if (isValidHttpUrl(text)) {
          text = `<a contenteditable="false" href="${text}" target="_blank">${text}</a>`;
        }

        document.execCommand('insertHTML', false, text);
      } else {
        ev.preventDefault();
        const base64Img = await toBase64(ev.clipboardData.files[0]);

        document.execCommand('insertHTML', false, `<img src="${base64Img}" />`);
      }

      this.setCaretPosition();
    }, { passive: false });

    this.editor.nativeElement.addEventListener('focus', ev => {
      this.setCaretPosition();
    });

    this.editor.nativeElement.addEventListener('keydown', ev => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;');
        this.editor.nativeElement.focus();
      }

      if (ev.ctrlKey) {
        this.emitKeyboardShortcut(ev);
      }
    }, { passive: false });

    fromEvent(this.editor.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.idle.emit();
      });

    this.setCaretPosition();
  }

  private setCaretPosition(atStart = false) {
    const el = this.editor.nativeElement;

    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(atStart);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  private emitKeyboardShortcut(ev: KeyboardEvent) {
    const keys = [];

    if (ev.ctrlKey) { keys.push('ctrl'); }
    if (ev.shiftKey) { keys.push('shift'); }

    keys.push(ev.key.toLowerCase());

    this.keyboardShortcut.emit(keys.join('+'));
  }
}
