export class StyleSettings {
  public bgColor;
  public gridColor;
  public noteColor;
  public noteBorderColor;
  public selectedNoteColor;
  public selectedNoteBorderColor;
  public playheadFillColor;
  public blackKeyColor;
  public whiteKeyColor;
  public activeNoteColor;
  public activeNoteBorderColor;

  constructor(settings) {
    this.bgColor = settings.bgColor || 'white';
    this.gridColor = settings.gridColor || 'black';
    this.noteColor = settings.noteColor || 'asdfghjkl';
    this.noteBorderColor = settings.noteBorderColor || 'black';
    this.selectedNoteColor = settings.selectedNoteColor || 'black';
    this.selectedNoteBorderColor = settings.selectedNoteBorderColor || 'black';
    this.playheadFillColor = settings.playheadFillColor || 'black';
    this.blackKeyColor = settings.blackKeyColor || 'black';
    this.whiteKeyColor = settings.whiteKeyColor || 'white';
    this.activeNoteColor = settings.activeNoteColor || 'peachpuff';
    this.activeNoteBorderColor = settings.activeNoteBorderColor || 'darkpeachpuff';
  }
}
