import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {Jot} from '../../model/jot';
import {JotRepository} from '../../repository/jot.repository';

@Component({
  selector: 'recent-jots',
  templateUrl: './recent-jots.component.html'
})
export class RecentJotsComponent {

  recentJots: Jot[];
  visible = false;

  @Output()
  selected: EventEmitter<Jot> = new EventEmitter<Jot>();

  @Output()
  hidden: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  shown: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('searchInput', { static: true })
  private readonly searchInput: ElementRef<HTMLInputElement>;

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
      this.searchInput.nativeElement.focus();
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
}
