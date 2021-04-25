import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'rt-editor',
  templateUrl: './md-editor.component.html'
})
export class MdEditorComponent implements AfterViewInit {

  @ViewChild('editable', {static: false})
  private readonly editor!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.editor.nativeElement.focus();
    this.editor.nativeElement.addEventListener('keyup', ev => {
      const el = ev.target as HTMLDivElement;

      if (ev.key === 'Enter') {
        
      }
    });
  }
}
