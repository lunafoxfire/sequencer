import { Component, OnInit } from '@angular/core';
import { Main } from '../models/main';
import { styles } from './sequencerStyle';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  main: Main = null;

  constructor() {}

  ngOnInit() {
    this.main = new Main('sequencer', styles);
  }
}
