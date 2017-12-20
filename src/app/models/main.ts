import * as Konva from 'konva';
import { PolySynth, Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';
import { Grid } from './../models/grid';
import { Playhead } from './../models/playhead';
import { Sidebar } from './../models/sidebar';
import { StyleSettings } from './../models/style-settings';

export class Main {
  private styles: StyleSettings = new StyleSettings({});

  private noteRangeMax: number = 12;
  private noteRangeMin: number = -12;
  private beatsPerMeasure: number = 4;
  private numMeasures: number = 2;
  private sidebarLayerWidth: number = 200;

  private stage: Konva.Stage;
  private sequencerHeight: number;
  private mainLayerWidth: number;
  private grid: Grid;
  private playhead: Playhead;
  private sidebar: Sidebar;

  private synth = new PolySynth(8, Synth).toMaster();
  private lastNoteAddedId: number = 0;
  private notes = {};
  private part: Part = new Part();

  constructor(containerId: string, styles: StyleSettings) {
    this.styles = styles;

    this.grid = new Grid(
      70, 40,
      this.numMeasures * this.beatsPerMeasure * 2,
      this.noteRangeMax - this.noteRangeMin + 1,
      this.styles.gridColor
    );
    this.sequencerHeight = this.grid.getPixelHeight();
    this.mainLayerWidth = this.grid.getPixelWidth();
    this.playhead = new Playhead(this.grid, this.styles.playheadFillColor);

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
    this.stage.add(mainLayer);
    this.initSideLayer();
    this.sidebar.addToLayer(this.stage);
    setInterval(this.draw.bind(this), 10);
  }

  private draw() {
    this.playhead.setPosition(Transport.progress * this.grid.getPixelWidth());
    this.stage.draw();
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
    this.playhead.addToLayer(mainLayer);
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
    this.grid.addToLayer(bgGroup);
    return bgGroup;
  }

  // i add dis TODO
  private initSideLayer() {
    this.sidebar = new Sidebar(this.noteRangeMax, this.sidebarLayerWidth, this.grid, this.synth);
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

  private addNoteToNoteGroup() {
    let clickX = this.stage.getPointerPosition().x - this.sidebarLayerWidth;
    let clickY = this.stage.getPointerPosition().y;
    let clickXBox = Math.floor(clickX / this.grid.cellWidth);
    let clickYBox = Math.floor(clickY / this.grid.cellHeight);

    let clickedNote = Note.convertNumToString(this.noteRangeMax - clickYBox);
    let clickedTime = Note.convertEigthNoteNumToMeasureString(clickXBox);
    let newNote: Note = new Note(clickedNote, clickedTime, '8n');
    this.synth.triggerAttackRelease(newNote.pitch, newNote.length);
    this.notes[this.lastNoteAddedId] = newNote;
    this.buildNotes();
    let notesGroup = this.stage.find('#notes-group')[0];
    let noteRect = new Konva.Rect({
      id: `${this.lastNoteAddedId}`,
      x: clickXBox * this.grid.cellWidth,
      y: clickYBox * this.grid.cellHeight,
      width: this.grid.cellWidth,
      height: this.grid.cellHeight,
      stroke: this.styles.noteBorderColor,
      strokeWidth: 1,
      fill: this.styles.noteColor
    });
    noteRect.on('click', this.removeNoteFromNoteGroup.bind(this));
    this.lastNoteAddedId++;
    notesGroup.add(noteRect);
  }

  private removeNoteFromNoteGroup(event) {
    delete this.notes[event.target.attrs.id];
    event.target.destroy();
    this.buildNotes();
  }

  public playPause() {
    Transport.loopEnd = `0:${this.numMeasures * this.beatsPerMeasure}`;
    Transport.loop = true;
    if (Transport.state !== "started") {
      Transport.start();
    }
    else if (Transport.state !== "stopped") {
      Transport.pause();
    }
  }

  public stop() {
    Transport.stop();
  }

  public setTempo(number:number){
    console.log(number);
    Transport.bpm.value = number;
  }

  public clearNotes(){
    this.notes = {};
    this.buildNotes(); // make this attached to notesGroup object in the future to reflect all changes made to notes-group
    this.stage.find("#notes-group")[0].destroyChildren();

  }
}
