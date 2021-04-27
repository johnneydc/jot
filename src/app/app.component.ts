import {Component, OnInit, ViewChild} from '@angular/core';
import {Jot} from './modules/jot/model/jot';
import {JotRepository} from './modules/jot/repository/jot.repository';
import {JotEditorComponent} from './modules/jot/component/jot-editor/jot-editor.component';
import {Command} from './modules/jot/shared/command';
import {RecentJotsComponent} from './modules/jot/component/recent-jots/recent-jots.component';

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

  @ViewChild('recents', { static: true })
  private readonly recents!: RecentJotsComponent;

  constructor(
    private readonly jotRepository: JotRepository
  ) { }


  async ngOnInit() {
    this.activeJot = Jot.ForNow();
    console.log(await this.jotRepository.findByRecent());
  }

  async saveCurrentJot() {
    if (!this.jotEditor.isTemporary && this.activeJot.content.body.trim() !== '') {
      this.saved = false;
      await this.jotRepository.save(this.activeJot);
      this.saved = true;
    }
  }

  toggleTemporary() {
    this.saved = false;
  }

  handleCommand(cmd: Command) {
    if (cmd === Command.OPEN_RECENT) {
      this.recents.toggleVisibility();
    }
  }

  setActive($event: Jot) {
    this.activeJot = $event;
    this.recents.toggleVisibility();
  }
}
