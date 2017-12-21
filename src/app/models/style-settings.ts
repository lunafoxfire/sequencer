export class StyleSettings {
  public backgroundColor;
  public noteGuideBlackColor;
  public noteGuideWhiteColor;
  public gridColor;
  public noteColor;
  public noteBorderColor;
  public selectedNoteColor;
  public selectedNoteBorderColor;
  public activeNoteColor;
  public activeNoteBorderColor;
  public playheadFillColor;
  public blackKeyColor;
  public whiteKeyColor;
  public activeBlackKeyColor;
  public activeWhiteKeyColor;

  constructor(settings) {
    this.backgroundColor = settings.backgroundColor || 'white';
    this.noteGuideBlackColor = settings.noteGuideBlackColor || '#ddd';
    this.noteGuideWhiteColor = settings.noteGuideWhiteColor || 'white';
    this.gridColor = settings.gridColor || 'black';
    this.noteColor = settings.noteColor || 'asdfghjkl';
    this.noteBorderColor = settings.noteBorderColor || 'black';
    this.selectedNoteColor = settings.selectedNoteColor || 'black';
    this.selectedNoteBorderColor = settings.selectedNoteBorderColor || 'black';
    this.activeNoteColor = settings.activeNoteColor || 'peachpuff';
    this.activeNoteBorderColor = settings.activeNoteBorderColor || 'darkpeachpuff';
    this.playheadFillColor = settings.playheadFillColor || 'black';
    this.blackKeyColor = settings.blackKeyColor || 'black';
    this.whiteKeyColor = settings.whiteKeyColor || 'white';
    this.activeBlackKeyColor = settings.activeBlackKeyColor || 'coral';
    this.activeWhiteKeyColor = settings.activeWhiteKeyColor || 'peachpuff';
  }
}
