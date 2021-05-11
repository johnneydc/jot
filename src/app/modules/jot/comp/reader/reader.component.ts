import {Component, Input} from '@angular/core';
import {Jot} from '@mod/jot/model/jot';
import {trimTags} from '@mod/core/utils/trimTags';

@Component({
  selector: 'reader',
  template: ``
})
export class ReaderComponent {

  @Input()
  jot: Jot;

  private readonly synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  read() {
    if (!this.synth) {
      return;
    }

    const text = trimTags(this.jot.content.body);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.8;
    this.synth.speak(utter);
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }
}
