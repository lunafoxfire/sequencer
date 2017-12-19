import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import { PolySynth, Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';

import { testSong } from './testSong';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  sequencerWidth: number = 1500;
  sequencerHeight: number = 900;
  gridWidth: number = 70;
  gridHeight: number = 70;
  stage: Konva.Stage;

  synth = new PolySynth(4, Synth).toMaster();
  notes: Note[] = testSong;

  constructor() {}

  ngOnInit() {
    this.initializeCanvas();
    this.buildNotes();
  }

  private initializeCanvas() {
    this.stage = new Konva.Stage({
      container: 'sequencer',
      width: this.sequencerWidth,
      height: this.sequencerHeight
    });
    let bgLayer = new Konva.Layer({
      name: 'background'
    });
    let bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.getWidth(),
      height: this.stage.getHeight(),
      fill: 'cyan'
    });
    bgRect.on('click', () => {
      console.log(this.stage.getPointerPosition());
    });
    bgLayer.add(bgRect);
    this.stage.add(bgLayer);
  }

  private buildNotes() {
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
