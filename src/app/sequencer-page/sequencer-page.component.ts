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

  constructor() {}

  ngOnInit() {
    this.main = new Main('sequencer', styles);
    let sequencerDiv = document.querySelector('#sequencer');
    let scrollPoint = this.main.sequencerHeight / 2 - sequencerDiv.clientHeight / 2;
    sequencerDiv.scroll(0, scrollPoint);

    let volumeValueSpan = document.querySelector('#hiddenVolumeValue');
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.main.setVolume(parseInt(mutation.target.textContent));
      });
    });
    var config = {
      attributes: true,
      childList: true,
      characterData: true
    }
    observer.observe(volumeValueSpan, config);
  }

  buttonToggleName() {
    if (nameToggle === "Play") {
      nameToggle = "Pause";
    } else { nameToggle = "Play" }
  }

  buttonToggleNameStop() {
    nameToggle = "Play"
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
