export class StyleSettings {
  public bgColor;
  public gridColor;
  public noteColor;
  public noteBorderColor;
  public selectedNoteColor;
  public selectedNoteBorderColor;
  public playheadLineColor;

  constructor(settings) {
    this.bgColor = settings.bgColor || 'white';
    this.gridColor = settings.gridColor || 'black';
    this.noteColor = settings.noteColor || 'asdfghjkl';
    this.noteBorderColor = settings.noteBorderColor || 'black';
    this.selectedNoteColor = settings.selectedNoteColor || 'black';
    this.selectedNoteBorderColor = settings.selectedNoteBorderColor || 'black';
    this.playheadLineColor = settings.playheadLineColor || 'black';
  }
}
