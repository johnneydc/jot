import {NgModule} from '@angular/core';
import {JotEditorComponent} from './jot-editor.component';
import {MdEditorModule} from '../md-editor/md-editor.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [JotEditorComponent],
  exports: [JotEditorComponent],
  imports: [MdEditorModule, FormsModule]
})
export class JotEditorModule { }
