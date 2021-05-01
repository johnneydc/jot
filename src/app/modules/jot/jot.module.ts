import {NgModule} from '@angular/core';
import {JotEditorComponent} from './component/jot-editor/jot-editor.component';
import {JotRepository} from './repository/jot.repository';
import {FormsModule} from '@angular/forms';
import {MdEditorModule} from '../md-editor/md-editor.module';
import {CoreModule} from '../core/core.module';
import {CommonModule} from '@angular/common';
import {RecentJotsComponent} from './component/recent-jots/recent-jots.component';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import {MatIconModule} from '@angular/material';

library.add(faCheckCircle);

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
    MatIconModule
  ],
  providers: [JotRepository]
})
export class JotModule { }
