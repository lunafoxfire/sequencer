import { Component, OnInit } from '@angular/core';
// TODO: Fix the thing pls
// import { Layer } from 'konva';
import { PolySynth, Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';

import { testSong } from './testSong';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  canvasWidth: number = 1000;
  canvasHeight: number = 600;
  gridWidth: number = 100;
  gridHeight: number = 100;

  synth = new PolySynth(4, Synth).toMaster();
  notes: Note[] = testSong;

  constructor() {}

  ngOnInit() {
    this.buildPart();
  }

  private buildPart() {
    let noteEvents = [];
    this.notes.forEach((note)=>{
      let noteEvent = {time: note.start, note: note.pitch, dur: note.length};
      noteEvents.push(noteEvent);
    });
    let part = new Part((time, event)=>{
      this.synth.triggerAttackRelease(event.note, event.dur, time)
    }, noteEvents);
    part.start(0);
  }

  public playStop() {
    if (Transport.state !== "started") {
      Transport.start('+0', '0');
    }
    else if (Transport.state !== "stopped") {
      Transport.stop();
    }
  }
}
