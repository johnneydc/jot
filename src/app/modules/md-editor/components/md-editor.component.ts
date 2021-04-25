import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'md-editor',
  templateUrl: './md-editor.component.html',
  styles: [`
    .rt-editor-input {
      white-space: pre-wrap;
    }
  `]
})
export class MdEditorComponent implements AfterViewInit {

  @Input()
  content: string;

  @Output()
  contentChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('editable', {static: false})
  private readonly editor!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.editor.nativeElement.addEventListener('paste', ev => {
      // cancel paste
      ev.preventDefault();

      // get text representation of clipboard
      const text = ev.clipboardData.getData('text/plain');

      // insert text manually
      document.execCommand('insertHTML', false, text);
    }, { passive: false });

    this.editor.nativeElement.addEventListener('focus', ev => {
      this.setCaretPosition();
    });

    this.editor.nativeElement.addEventListener('keyup', ev => {
      this.contentChange.emit(this.editor.nativeElement.innerHTML);
    }, { passive: true });

    this.editor.nativeElement.addEventListener('keydown', ev => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;');
        this.editor.nativeElement.focus();
      }
    }, { passive: false });

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
