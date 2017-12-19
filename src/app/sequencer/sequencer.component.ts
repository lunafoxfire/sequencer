import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import { PolySynth, Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';

import { styles } from './sequencerStyle';
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
  gridHeight: number = 40;
  mainStage: Konva.Stage;
  sideStage: Konva.Stage;

  synth = new PolySynth(4, Synth).toMaster();
  notes: Note[] = testSong;

  constructor() {}

  ngOnInit() {
    this.initGUI();
    this.buildNotes();
  }

  private initGUI() {
    this.initMainStage();
    this.initSideStage();
  }

  private initMainStage() {
    this.mainStage = new Konva.Stage({
      container: 'sequencer',
      x: 200,
      y: 0,
      width: this.sequencerWidth,
      height: this.sequencerHeight
    });
    this.initMainBackground();
    this.initMainGrid();
  }
  private initMainBackground() {
    let bgLayer = new Konva.Layer({
      name: 'background'
    });
    let bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.mainStage.getWidth(),
      height: this.mainStage.getHeight(),
      fill: styles.bgColor
    });
    bgRect.on('click', () => {
      console.log(this.mainStage.getPointerPosition());
    });
    bgLayer.add(bgRect);
    this.mainStage.add(bgLayer);
  }
  private initMainGrid() {
    let gridLayer = new Konva.Layer({
      name: 'grid'
    });
    let numVertLines = this.sequencerWidth / this.gridWidth;
    let numHorizLines = this.sequencerHeight / this.gridHeight;
    for (let i = 0; i <= numVertLines; i++) {
      let lineWidth = (i % 4 === 0) ? 2 : 1;
      let line = new Konva.Line({
        points: [this.gridWidth * i, 0, this.gridWidth * i, this.sequencerHeight],
        stroke: styles.gridColor,
        strokeWidth: lineWidth
      });
      gridLayer.add(line);
    }
    for (let j = 1; j <= numHorizLines; j++) {
      let line = new Konva.Line({
        points: [0, this.gridHeight * j, this.sequencerWidth, this.gridHeight * j],
        stroke: styles.gridColor,
        strokeWidth: 1
      });
      gridLayer.add(line);
    }
    this.mainStage.add(gridLayer);
  }

  private initSideStage() {
    // TODO: stuff
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
