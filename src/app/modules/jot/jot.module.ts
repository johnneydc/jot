import {NgModule} from '@angular/core';
import {JotEditorComponent} from './component/jot-editor/jot-editor.component';
import {JotRepository} from './repository/jot.repository';
import {FormsModule} from '@angular/forms';
import {MdEditorModule} from '../md-editor/md-editor.module';
import {CoreModule} from '../core/core.module';
import {CommonModule} from '@angular/common';
import {RecentJotsComponent} from './component/recent-jots/recent-jots.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    JotEditorComponent,
    RecentJotsComponent
  ],
  exports: [
    JotEditorComponent,
    RecentJotsComponent
  ],
  imports: [
      FormsModule,
      MdEditorModule,
      CoreModule,
      CommonModule,
      FontAwesomeModule
  ],
  providers: [JotRepository]
})
export class JotModule { }
