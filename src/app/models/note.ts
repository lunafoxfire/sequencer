export class Note {
  constructor(
    public pitchNumber: number,
    public measurePosition: number,
    public length: string
  ) {}

  public static getPitchAsString(pitchNumber) {
    let octave: number = Math.floor(pitchNumber / 12) + 4;
    let pitchClassNumber = pitchNumber % 12;
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

  public getPitchString() {
    return Note.getPitchAsString(this.pitchNumber);
  }

  public getMeasurePositionString() {
    return `0:${(this.measurePosition / 2)}`
  }

  static isBlackKey(number:number){
    let pitchClassNumber = number % 12;
    if (pitchClassNumber < 0) {
      pitchClassNumber += 12;
    }
    if ([1,3,6,8,10].includes(pitchClassNumber)){
      return true;
    } else {
      return false;
    }
  }
}
