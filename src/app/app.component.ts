import {Component, OnInit, ViewChild} from '@angular/core';
import {Jot} from './modules/jot/model/jot';
import {JotRepository} from './modules/jot/repository/jot.repository';
import {JotEditorComponent} from './modules/jot/component/jot-editor/jot-editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  activeJot: Jot;
  saved = false;

  @ViewChild('editor', { static: true })
  private readonly jotEditor!: JotEditorComponent;

  constructor(
    private readonly jotRepository: JotRepository
  ) { }


  ngOnInit() {
    this.activeJot = Jot.ForNow();
  }

  async saveCurrentJot() {
    if (!this.jotEditor.isTemporary) {
      this.saved = false;
      await this.jotRepository.save(this.activeJot);
      this.saved = true;
    }
  }

  toggleTemporary() {
    this.saved = false;
  }
}
