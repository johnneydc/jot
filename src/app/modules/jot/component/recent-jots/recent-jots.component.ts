import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Jot} from '../../model/jot';
import {JotRepository} from '../../repository/jot.repository';

@Component({
  selector: 'recent-jots',
  templateUrl: './recent-jots.component.html'
})
export class RecentJotsComponent implements OnInit {

  recentJots: Jot[];
  shown = false;

  @Output()
  selected: EventEmitter<Jot> = new EventEmitter<Jot>();

  constructor(
    private readonly jotRepository: JotRepository,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.recentJots = await this.jotRepository.findByRecent();
  }

  toggleVisibility() {
    this.shown = !this.shown;
    this.cdRef.markForCheck();
  }

  emitSelected(jot: Jot) {
    this.selected.emit(jot);
  }
}
