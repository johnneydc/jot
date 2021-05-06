import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Jot} from './modules/jot/model/jot';
import {JotRepository} from './modules/jot/repository/jot.repository';
import {CommandEvent, JotEditorComponent} from './modules/jot/component/jot-editor/jot-editor.component';
import {Command} from './modules/jot/shared/command';
import {RecentJotsComponent} from './modules/jot/component/recent-jots/recent-jots.component';
import {v4} from 'uuid';
import {time} from './modules/core/utils/time';
import {ToastService} from './modules/core/services/toast.service';
import {ActivatedRoute} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  activeJot: Jot;
  saved = false;

  @ViewChild('editor', { static: true })
  private readonly jotEditor!: JotEditorComponent;

  @ViewChild('recents', { static: true })
  private readonly recents!: RecentJotsComponent;

  constructor(
    private readonly jotRepository: JotRepository,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly title: Title
  ) { }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const temp = params.get('temporary');

      if (temp) {
        this.jotEditor.toggleTemporary();
      }
    });

    this.activeJot = Jot.New();
    this.title.setTitle(`Jot v${environment.appVersion} | ${this.activeJot.meta.title}`);
  }

  async ngAfterViewInit() {
    this.jotEditor.idle.asObservable()
      .pipe(debounceTime(3000))
      .subscribe(() => {
        this.saveCurrentJot();
      });
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
    await time(1000);
    this.saved = true;
    this.toastService.show('Jot saved.');
  }

  toggleTemporary() {
    this.saved = false;
  }

  handleCommand({command, event}: CommandEvent) {
    switch (command) {
      case Command.OPEN_RECENT:
        this.recents.show();
        break;
      case Command.NEW_JOT:
        this.openNewJot();
        break;
      case Command.NEW_TEMPORARY_JOT:
        this.openNewTemporaryJot();
        event.preventDefault();
        break;
    }
  }

  setActive($event: Jot) {
    this.activeJot = $event;
    this.recents.hide();
  }

  focusEditor() {
    this.jotEditor.focus();
  }

  private openNewJot() {
    window.open(location.href);
  }

  private openNewTemporaryJot() {
    window.open(`${location.href}?temporary=true`);
  }
}
