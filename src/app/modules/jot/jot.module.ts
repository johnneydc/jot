import {NgModule} from '@angular/core';
import {JotEditorComponent} from './component/jot-editor/jot-editor.component';
import {JotRepository} from './repository/jot.repository';
import {FormsModule} from '@angular/forms';
import {MdEditorModule} from '../md-editor/md-editor.module';
import {CoreModule} from '../core/core.module';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [JotEditorComponent],
  exports: [JotEditorComponent],
  imports: [
    FormsModule,
    MdEditorModule,
    CoreModule,
    CommonModule
  ],
  providers: [JotRepository]
})
export class JotModule { }
