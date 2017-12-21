import { Component, OnInit } from '@angular/core';
import { Main } from '../models/main';
import { styles } from './sequencer-styles';

let nameToggle = "Play";

@Component({
  selector: 'app-sequencer-page',
  templateUrl: './sequencer-page.component.html',
  styleUrls: ['./sequencer-page.component.scss']
})
export class SequencerPageComponent implements OnInit {
  main: Main = null;
  tempo: number = 120;
  volume: number = 30;

  constructor() {}

  ngOnInit() {
    this.main = new Main('sequencer', styles);
  }

  buttonToggleName() {
    if (nameToggle === "Play") {
      nameToggle = "Pause";
    } else { nameToggle = "Play" }
  }

  buttonToggleNameValue() {
    return nameToggle;
  }

  buttonToggle() {
    var variable = document.querySelector('#play-pause').classList;
    if (variable.contains("paused") === true) {
      variable.remove('paused');
    } else { variable.add('paused') }
  }

  activateInstrument(instrument: string) {
    this.main.setInstrument(instrument);
  }
}
