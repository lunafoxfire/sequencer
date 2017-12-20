import { Component, OnInit } from '@angular/core';
import { Main } from '../models/main';

let nameToggle = "Play";


@Component({
  selector: 'app-sequencer-page',
  templateUrl: './sequencer-page.component.html',
  styleUrls: ['./sequencer-page.component.scss']
})
export class SequencerPageComponent implements OnInit {

  constructor() { }

  buttonToggleName() {
    console.log(nameToggle);
    if (nameToggle === "Play") {
      nameToggle = "Pause";
    } else { nameToggle = "Play" }
  }

  buttonToggleNameValue() {
    return nameToggle;
  }
  
  buttonToggle() {
    // alert("toggle");
    var variable = document.querySelector('#play-pause').classList;
    if (variable.contains("paused") === true) {
      variable.remove('paused');
    } else { variable.add('paused') }
  }

  ngOnInit() {}

  public playStop() {
    Main.playStop();
  }
}
