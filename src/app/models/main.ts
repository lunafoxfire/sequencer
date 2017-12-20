import * as Konva from 'konva';
import { PolySynth, Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';
import { StyleSettings } from './../models/style-settings';

export class Main {
  private styles: StyleSettings;

  private gridHeight: number = 40;
  private noteRangeMax: number = 12;
  private noteRangeMin: number = -12;
  private numRows: number = this.noteRangeMax - this.noteRangeMin + 1;
  private sequencerHeight: number = this.gridHeight * this.numRows;

  private gridSquaresPerMeasure: number = 8;
  private numMeasures: number = 2;
  private gridWidth: number = 70;
  private mainLayerWidth: number = this.numMeasures * this.gridSquaresPerMeasure * this.gridWidth;

  private sidebarLayerWidth: number = 200;
  private stage: Konva.Stage;

  private synth = new PolySynth(8, Synth).toMaster();
  private lastNoteAddedId: number = 0;
  private notes = {};
  private part: Part = new Part();

  constructor(containerId: string, styles: StyleSettings) {
    this.styles = styles;
    this.initGUI(containerId);
    this.buildNotes();
  }

  private initGUI(containerId: string) {
    this.stage = new Konva.Stage({
      container: containerId,
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
      fill: this.styles.bgColor
    });
    bgRect.on('click', this.addNoteToNoteGroup.bind(this));
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
        stroke: this.styles.gridColor,
        strokeWidth: lineWidth
      });
      gridGroup.add(line);
    }
    for (let j = 1; j <= numHorizLines; j++) {
      let line = new Konva.Line({
        points: [0, this.gridHeight * j, this.mainLayerWidth, this.gridHeight * j],
        stroke: this.styles.gridColor,
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
    let keys = Object.keys(this.notes);
    keys.forEach((key)=>{
      let noteEvent = {time: this.notes[key].start, note: this.notes[key].pitch, dur: this.notes[key].length};
      noteEvents.push(noteEvent);
    });
    this.part = new Part((time, event)=>{
      this.synth.triggerAttackRelease(event.note, event.dur, time)
    }, noteEvents);
    this.part.start(0);
  }

  private addNoteToNoteGroup(note: Note, boxX: number, boxY: number) {
    let clickX = this.stage.getPointerPosition().x - this.sidebarLayerWidth;
    let clickY = this.stage.getPointerPosition().y;
    let clickXBox = Math.floor(clickX / this.gridWidth);
    let clickYBox = Math.floor(clickY / this.gridHeight);

    let clickedNote = Note.convertNumToString(this.noteRangeMax - clickYBox);
    let clickedTime = Note.convertEigthNoteNumToMeasureString(clickXBox);
    let newNote: Note = new Note(clickedNote, clickedTime, '8n');
    this.notes[this.lastNoteAddedId] = newNote;
    this.buildNotes();
    let notesGroup = this.stage.find('#notes-group')[0];
    let noteRect = new Konva.Rect({
      id: `${this.lastNoteAddedId}`,
      x: clickXBox * this.gridWidth,
      y: clickYBox * this.gridHeight,
      width: this.gridWidth,
      height: this.gridHeight,
      stroke: 'green',
      strokeWidth: 1,
      fill: 'lime'
    });
    noteRect.on('click', this.removeNoteFromNoteGroup.bind(this));
    this.lastNoteAddedId++;
    notesGroup.add(noteRect);
    notesGroup.draw();
  }

  private removeNoteFromNoteGroup(event) {
    delete this.notes[event.target.attrs.id];
    event.target.destroy();
    this.buildNotes();
    this.stage.draw();
    console.log(this.notes);
  }

  public static playStop() {
    Transport.loopEnd = '1m';
    Transport.loop = true;
    if (Transport.state !== "started") {
      Transport.start('+0', 0);
    }
    else if (Transport.state !== "stopped") {
      Transport.stop();
    }
  }
}
