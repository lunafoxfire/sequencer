import { Component, OnInit } from '@angular/core';
import { PolySynth, Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  synth = new PolySynth(4, Synth).toMaster();
  notes: Note[] = [
    new Note('G4', '0:1', '8n'),
    new Note('D4', '0:2', '8n'),
    new Note('G4', '0:3.5', '8n'),
    new Note('G4', '0:4', '8n'),
    new Note('A4', '0:4.25', '8n'),
    new Note('B4', '0:4.5', '8n'),
    new Note('C5', '0:4.75', '8n'),

    new Note('D5', '1:1', '8n'),
    new Note('D5', '1:3.5', '8n'),
    new Note('D5', '1:4', '8n'),
    new Note('Eb5', '1:4 + 8t', '8n'),
    new Note('F5', '1:4 + 8t + 8t', '8n'),
    new Note('G5', '2:1', '8n'),

    new Note('G5', '2:3.5', '8n'),
    new Note('G5', '2:4', '8n'),
    new Note('F5', '2:4 + 8t', '8n'),
    new Note('Eb5', '2:4 + 8t + 8t', '8n'),
    new Note('F5', '3:1', '8n'),
    new Note('Eb5', '3:1.75', '8n'),
    new Note('D5', '3:2', '8n')
  ];

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
