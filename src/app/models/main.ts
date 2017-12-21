import * as Konva from 'konva';
import { Master, Transport, PolySynth, Synth, Part } from 'tone';
import { Note } from './../models/note';
import { Grid } from './../models/grid';
import { Background } from './../models/background';
import { Playhead } from './../models/playhead';
import { Sidebar } from './../models/sidebar';
import { StyleSettings } from './../models/style-settings';

export class Main {
  public styles: StyleSettings = new StyleSettings({});

  public noteRangeMax: number = 24;
  public noteRangeMin: number = -24;
  public beatsPerMeasure: number = 4;
  public numMeasures: number = 2;
  public sidebarWidth: number = 87;

  public stage: Konva.Stage;
  public sequencerHeight: number;
  public mainLayerWidth: number;
  public grid: Grid;
  public playhead: Playhead;
  public sidebar: Sidebar;

  public synth;
  public notes = {};
  public lastNoteAddedId: number = 0;
  public part: Part = new Part();

  constructor(containerId: string, styles: StyleSettings) {
    this.styles = styles;
    this.setInstrument('square');
    this.grid = new Grid(
      56, 26,
      this.numMeasures * this.beatsPerMeasure * 2,
      this.noteRangeMax - this.noteRangeMin + 1,
      this.beatsPerMeasure,
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
      width: this.mainLayerWidth + this.sidebarWidth,
      height: this.sequencerHeight
    });
    let mainLayer: Konva.Layer = this.initMainLayer();
    this.stage.add(mainLayer);
    this.sidebar = new Sidebar(this);
    this.sidebar.addToLayer(this.stage);
    setInterval(this.draw.bind(this), 10);
  }

  private draw() {
    this.drawPlayEffects();
    this.stage.draw();
  }

  private drawPlayEffects() {
    let playPosition = Transport.progress * this.grid.getPixelWidth();
    this.playhead.setPosition(playPosition);
    let noteRects = this.stage.find('#notes-group')[0].getChildren();
    noteRects.forEach((noteRect) => {
      if (noteRect.x() < playPosition && playPosition < noteRect.x() + noteRect.width()) {
          noteRect.fill(this.styles.activeNoteColor);
          noteRect.stroke(this.styles.activeNoteBorderColor);
      }
      else {
        noteRect.fill(this.styles.noteColor);
        noteRect.stroke(this.styles.noteBorderColor);
      }
    });
  }

  private initMainLayer() {
    let mainLayer: Konva.Layer = new Konva.Layer({
      id: 'main-layer',
      x: this.sidebarWidth
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
      fill: this.styles.backgroundColor
    });
    bgRect.on('click', this.addNoteToNoteGroup.bind(this));
    bgGroup.add(bgRect);
    let background = new Background(this.noteRangeMax, this.grid, this.styles);
    background.addToLayer(bgGroup);
    this.grid.addToLayer(bgGroup);
    return bgGroup;
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
    let clickX = this.stage.getPointerPosition().x - this.sidebarWidth;
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
    Transport.bpm.value = number;
  }

  public setVolume(volumeKnobPercentage: number) {
    if (volumeKnobPercentage > 100) {
      volumeKnobPercentage = 100;
    }
    else if (volumeKnobPercentage < 0) {
      volumeKnobPercentage = 0;
    }
    let volume = 30 * (volumeKnobPercentage / 100) - 30;
    if (volumeKnobPercentage === 0) {
      volume = -100;
    }
    console.log(`Volume: ${volume}`);
    Master.volume.value = volume;
  }

  public setInstrument(instrument: string) {
    let maxVoices = 8;
    let baseSynth = null;
    switch(instrument) {
      case 'square':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'square'
          },
          envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.5,
            release: 0.005
          },
          volume: -16
        });
        break;

      case 'sine':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.5,
            release: 0.005
          },
          volume: -3
        });
        break;

      case 'saw':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'sawtooth'
          },
          envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.5,
            release: 0.005
          },
          volume: -16
        });
        break;

      case 'triangle':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'triangle'
          },
          envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.5,
            release: 0.005
          },
          volume: -3
        });
        break;

      case 'pluck':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'triangle'
          },
          envelope: {
            attack: 0.005,
            decay: 0.3,
            sustain: 0.0,
            release: 0.2
          },
          volume: -2
        });
        break;

      case 'poot':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'pwm',
            modulationFrequency: 100,
          },
          envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 0.005
          },
          volume: -16
        });
        break;

      case 'doot':
        baseSynth = new PolySynth(maxVoices, Synth).set({
          oscillator: {
            type: 'fatsquare',
            spread: 5,
            count: 4
          },
          envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.3,
            release: 0.005
          },
          volume: -12
        });
        break;

      // case 'drums':
      //   console.log('drums');
      //   break;
    }
    if (baseSynth) {
      this.synth = baseSynth.toMaster();
    }
  }

  public clearNotes(){
    this.notes = {};
    this.buildNotes(); // make this attached to notesGroup object in the future to reflect all changes made to notes-group
    this.stage.find("#notes-group")[0].destroyChildren();

  }
}
