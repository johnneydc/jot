import {Component, OnInit} from '@angular/core';
import {Jot} from './modules/jot-editor/models/jot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  activeJot: Jot;

  ngOnInit() {
    this.activeJot = Jot.ForNow();
  }

  displayValue() {
    console.log(this.activeJot);
  }
}
