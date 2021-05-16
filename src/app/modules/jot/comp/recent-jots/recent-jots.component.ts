import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {Jot} from '@mod/jot/model/jot';
import {JotRepository} from '@mod/jot/repo/jot.repository';
import {Command} from '@mod/jot/shared/command';
import {CommandEvent} from '@mod/jot/comp/jot-editor/jot-editor.component';

@Component({
  selector: 'recent-jots',
  templateUrl: './recent-jots.component.html'
})
export class RecentJotsComponent {

  recentJots: Jot[] = [];
  visible = false;

  @Output()
  selected: EventEmitter<Jot> = new EventEmitter<Jot>();

  @Output()
  hidden: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  shown: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  command: EventEmitter<CommandEvent> =  new EventEmitter<CommandEvent>();

  @ViewChild('searchInput', { static: true })
  private readonly searchInput: ElementRef<HTMLInputElement>;

  @ViewChild('closeBtn', { static: true })
  private readonly closeBtn: ElementRef<HTMLDivElement>;

  constructor(
    private readonly jotRepository: JotRepository,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  async show() {
    this.visible = true;
    this.recentJots = await this.jotRepository.findByRecent();
    this.cdRef.markForCheck();

    this.shown.emit();

    setTimeout(() => {
      this.closeBtn.nativeElement.focus();
    }, 200);
  }

  async hide() {
    this.visible = false;
    this.hidden.emit();
    this.cdRef.markForCheck();
  }

  emitSelected(jot: Jot) {
    this.selected.emit(jot);
  }

  hideDialog($event: MouseEvent) {
    $event.stopImmediatePropagation();
    this.hide();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.hide();
    }

    if (event.key === 'n') {
      event.preventDefault();
      this.command.emit({
        command: Command.NEW_JOT, event
      });
      this.hide();
    }
  }

  async deleteJot($event: MouseEvent, jot: Jot) {
    $event.stopImmediatePropagation();
    await this.jotRepository.delete(jot);
    this.recentJots = await this.jotRepository.findByRecent();
    this.cdRef.markForCheck();
  }
}
