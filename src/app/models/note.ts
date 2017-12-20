export class Note {
  constructor(
    public pitch: string,
    public start: string,
    public length: string
  ) {}

  static convertNumToString(noteNumber: number) {
    // 0 => C4
    let octave: number = Math.floor(noteNumber / 12) + 4;
    let pitchClassNumber = noteNumber % 12;
    if (pitchClassNumber < 0) {
      pitchClassNumber += 12;
    }
    let pitchClass: string;
    switch (pitchClassNumber) {
      case 0:
        pitchClass = 'C';
        break;
      case 1:
        pitchClass = 'C#';
        break;
      case 2:
        pitchClass = 'D';
        break;
      case 3:
        pitchClass = 'D#';
        break;
      case 4:
        pitchClass = 'E';
        break;
      case 5:
        pitchClass = 'F';
        break;
      case 6:
        pitchClass = 'F#';
        break;
      case 7:
        pitchClass = 'G';
        break;
      case 8:
        pitchClass = 'G#';
        break;
      case 9:
        pitchClass = 'A';
        break;
      case 10:
        pitchClass = 'A#';
        break;
      case 11:
        pitchClass = 'B';
        break;
    }
    return pitchClass + octave;
  }

  static convertEigthNoteNumToMeasureString(number: number) {
    return `0:${(number / 2)}`
  }
}
