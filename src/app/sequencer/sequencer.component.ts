import { Component, OnInit } from '@angular/core';
import { Synth, Transport, Part } from 'tone';
import { Note } from './../models/note';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  synth: Synth = new Synth().toMaster();
  notes: Note[] = [
    new Note('E4', '0:1', '8n'),
    new Note('D4', '0:2', '8n'),
    new Note('C4', '0:3', '8n'),
    new Note('D4', '0:4', '8n'),
    new Note('E4', '1:1', '8n'),
    new Note('E4', '1:2', '8n'),
    new Note('E4', '1:3', '8n')
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
    Transport.start('0');
  }
}
