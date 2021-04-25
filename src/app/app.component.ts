import {Component, OnInit} from '@angular/core';
import {Jot} from './modules/jot/model/jot';
import {JotRepository} from './modules/jot/repository/jot.repository';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  activeJot: Jot;
  saved = false;

  constructor(
    private readonly jotRepository: JotRepository
  ) { }


  ngOnInit() {
    this.activeJot = Jot.ForNow();
  }

  async saveCurrentJot() {
    this.saved = false;
    await this.jotRepository.save(this.activeJot);
    this.saved = true;
  }
}
