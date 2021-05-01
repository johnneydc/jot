import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Jot} from './modules/jot/model/jot';
import {JotRepository} from './modules/jot/repository/jot.repository';
import {JotEditorComponent} from './modules/jot/component/jot-editor/jot-editor.component';
import {Command} from './modules/jot/shared/command';
import {RecentJotsComponent} from './modules/jot/component/recent-jots/recent-jots.component';
import {v4} from 'uuid';
import {wait} from './modules/core/utils/wait';
import {MatSnackBar} from '@angular/material';
import {ToastService} from './modules/core/services/toast.service';

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
    private readonly jotRepository: JotRepository,
    private readonly toastService: ToastService
  ) { }

  async ngOnInit() {
    this.activeJot = Jot.New();
  }

  async saveCurrentJot() {
    if (this.jotEditor.isTemporary || this.activeJot.content.body.trim().length === 0) {
      return;
    }

    if (this.activeJot.id === null) {
      this.activeJot.id = v4();
    } else {
      this.activeJot.meta.dateModified = new Date();
    }

    this.saved = false;
    await this.jotRepository.save(this.activeJot);
    await wait(1000);
    this.saved = true;
    this.toastService.show('Jot saved.');
  }

  toggleTemporary() {
    this.saved = false;
  }

  handleCommand(cmd: Command) {
    if (cmd === Command.OPEN_RECENT) {
      this.recents.show();
    }
  }

  setActive($event: Jot) {
    this.activeJot = $event;
    this.recents.hide();
  }

  focusEditor() {
    this.jotEditor.focus();
  }
}
