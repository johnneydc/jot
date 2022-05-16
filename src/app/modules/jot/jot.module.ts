import {NgModule} from '@angular/core';
import {CoreModule} from '@mod/core/core.module';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons/faCheckCircle';

import {JotEditorComponent} from './comp/jot-editor/jot-editor.component';
import {JotRepository} from './repo/jot.repository';
import {FormsModule} from '@angular/forms';
import {MdEditorModule} from '../md-editor/md-editor.module';
import {RecentJotsComponent} from './comp/recent-jots/recent-jots.component';
import {ReaderComponent} from '@mod/jot/comp/reader/reader.component';
import {ScrollingModule} from '@angular/cdk/scrolling';

library.add(faCheckCircle);

@NgModule({
  declarations: [
    JotEditorComponent,
    RecentJotsComponent,
    ReaderComponent
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
      MatIconModule,
      ScrollingModule
    ],
  providers: [JotRepository]
})
export class JotModule { }
