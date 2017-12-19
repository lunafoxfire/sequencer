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
  gridHeight: number = 40;
  noteRangeMax: number = 12;
  noteRangeMin: number = -12;
  numRows: number = this.noteRangeMax - this.noteRangeMin + 1;
  sequencerHeight: number = this.gridHeight * this.numRows;

  // TODO: Set width based on number of measures
  gridSquaresPerMeasure: number = 8;
  numMeasures: number = 2;
  gridWidth: number = 70;
  mainLayerWidth: number = this.numMeasures * this.gridSquaresPerMeasure * this.gridWidth;

  sidebarLayerWidth: number = 200;
  stage: Konva.Stage;

  synth = new PolySynth(8, Synth).toMaster();
  notes: Note[] = [];
  part: Part = new Part();

  constructor() {}

  ngOnInit() {
    this.initGUI();
    this.buildNotes();
  }

  private initGUI() {
    this.stage = new Konva.Stage({
      container: 'sequencer',
      width: this.mainLayerWidth + this.sidebarLayerWidth,
      height: this.sequencerHeight
    });
    let mainLayer: Konva.Layer = this.initMainLayer();
    let sidebarLayer: Konva.Layer = this.initSideLayer();
    this.stage.add(mainLayer);
    this.stage.add(sidebarLayer);
  }

  private initMainLayer() {
    let mainLayer: Konva.Layer = new Konva.Layer({
      id: 'main-layer',
      x: this.sidebarLayerWidth
    });
    let bgGroup: Konva.Group = this.initBackgroundGroup();
    mainLayer.add(bgGroup);
    let notesGroup: Konva.Group = new Konva.Group({
      id: 'notes-group'
    });
    mainLayer.add(notesGroup);
    return mainLayer;
  }
  private initBackgroundGroup() {
    let bgGroup = new Konva.Group({
      id: 'background-group'
    });
    let bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.getWidth(),
      height: this.stage.getHeight(),
      fill: styles.bgColor
    });
    bgRect.on('click', () => {
      let clickX = this.stage.getPointerPosition().x - this.sidebarLayerWidth;
      let clickY = this.stage.getPointerPosition().y;
      let clickXBox = Math.floor(clickX / this.gridWidth);
      let clickYBox = Math.floor(clickY / this.gridHeight);

      let clickedNote = Note.convertNumToString(this.noteRangeMax - clickYBox);
      let clickedTime = Note.convertEigthNoteNumToMeasureString(clickXBox);
      let newNote: Note = new Note(clickedNote, clickedTime, '8n');
      this.notes.push(newNote);
      this.buildNotes();
      let notesGroup = this.stage.find('#notes-group')[0];
      let noteRect = new Konva.Rect({
        x: clickXBox * this.gridWidth,
        y: clickYBox * this.gridHeight,
        width: this.gridWidth,
        height: this.gridHeight,
        fill: 'lime'
      });
      notesGroup.add(noteRect);
      notesGroup.draw();
      console.log(this.notes);
    });
    bgGroup.add(bgRect);
    let gridGroup: Konva.Group = this.initGridGroup();
    bgGroup.add(gridGroup);
    return bgGroup;
  }
  private initGridGroup() {
    let gridGroup = new Konva.Group({
      id: 'grid-group'
    });
    let numVertLines = this.mainLayerWidth / this.gridWidth;
    let numHorizLines = this.sequencerHeight / this.gridHeight;
    for (let i = 0; i <= numVertLines; i++) {
      let lineWidth = (i % 8 === 0) ? 4 : (i % 4 === 0) ? 2 : 1;
      let line = new Konva.Line({
        points: [this.gridWidth * i, 0, this.gridWidth * i, this.sequencerHeight],
        stroke: styles.gridColor,
        strokeWidth: lineWidth
      });
      gridGroup.add(line);
    }
    for (let j = 1; j <= numHorizLines; j++) {
      let line = new Konva.Line({
        points: [0, this.gridHeight * j, this.mainLayerWidth, this.gridHeight * j],
        stroke: styles.gridColor,
        strokeWidth: 1
      });
      gridGroup.add(line);
    }
    return gridGroup;
  }

  private initSideLayer() {
    // TODO: stuff
    let sidebarLayer: Konva.Layer = new Konva.Layer({
      id: 'sidebar-layer'
    });
    return sidebarLayer;
  }

  private buildNotes() {
    this.part.removeAll();
    let noteEvents = [];
    this.notes.forEach((note)=>{
      let noteEvent = {time: note.start, note: note.pitch, dur: note.length};
      noteEvents.push(noteEvent);
    });
    this.part = new Part((time, event)=>{
      this.synth.triggerAttackRelease(event.note, event.dur, time)
    }, noteEvents);
    this.part.start(0);
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
