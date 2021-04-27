import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Jot} from '../../model/jot';
import {JotRepository} from '../../repository/jot.repository';

@Component({
  selector: 'recent-jots',
  templateUrl: './recent-jots.component.html'
})
export class RecentJotsComponent {

  recentJots: Jot[];
  shown = false;

  @Output()
  selected: EventEmitter<Jot> = new EventEmitter<Jot>();

  @ViewChild('searchInput', { static: true })
  private readonly searchInput: ElementRef<HTMLInputElement>;

  constructor(
    private readonly jotRepository: JotRepository,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  async show() {
    this.shown = true;
    this.recentJots = await this.jotRepository.findByRecent();
    this.cdRef.markForCheck();

    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 200);
  }

  async hide() {
    this.shown = false;
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
