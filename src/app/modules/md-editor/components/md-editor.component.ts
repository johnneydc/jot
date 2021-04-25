import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject, fromEvent} from 'rxjs';
import {debounceTime, first} from 'rxjs/operators';

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

  value$: Subject<string> = new Subject<string>();
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
      .pipe(first())
      .subscribe(val => {
        this.editor.nativeElement.innerHTML = val.toString();
        this.setCaretPosition();
      });

    this.editor.nativeElement.addEventListener('paste', ev => {
      ev.preventDefault();
      const text = ev.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
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
}
