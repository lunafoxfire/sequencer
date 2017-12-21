import { Note } from './note';

export class Song {
  constructor(
    public title: string,
    public author: string,
    public tempo: number,
    public instrument: string,
    public notes: Note[]
  ) {}
}
