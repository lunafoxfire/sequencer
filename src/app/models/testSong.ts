import { Song } from './../models/song';
import { Note } from './../models/note';

export let testSong = new Song(
  'Great Song',
  'Me',
  120,
  'sine',
  [
    new Note(0, 0, '8n'),
    new Note(1, 1, '8n'),
    new Note(2, 2, '8n'),
    new Note(3, 3, '8n'),
    new Note(-1, 4, '8n'),
    new Note(-2, 5, '8n'),
    new Note(-3, 6, '8n'),
    new Note(10, 7, '8n'),
  ]
);

// export let testSong: Note[] = [
//   new Note('G4', '0:1', '8n'),
//   new Note('D4', '0:2', '8n'),
//   new Note('G4', '0:3.5', '8n'),
//   new Note('G4', '0:4', '8n'),
//   new Note('A4', '0:4.25', '8n'),
//   new Note('B4', '0:4.5', '8n'),
//   new Note('C5', '0:4.75', '8n'),
//
//   new Note('D5', '1:1', '8n'),
//   new Note('D5', '1:3.5', '8n'),
//   new Note('D5', '1:4', '8n'),
//   new Note('Eb5', '1:4 + 8t', '8n'),
//   new Note('F5', '1:4 + 8t + 8t', '8n'),
//   new Note('G5', '2:1', '8n'),
//
//   new Note('G5', '2:3.5', '8n'),
//   new Note('G5', '2:4', '8n'),
//   new Note('F5', '2:4 + 8t', '8n'),
//   new Note('Eb5', '2:4 + 8t + 8t', '8n'),
//   new Note('F5', '3:1', '8n'),
//   new Note('Eb5', '3:1.75', '8n'),
//   new Note('D5', '3:2', '8n')
// ];
