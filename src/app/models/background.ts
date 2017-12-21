import * as Konva from 'konva';
import { Note } from './note';
import { Grid } from './grid';
import { StyleSettings } from './style-settings';

export class Background {
  public group: Konva.Group;

  constructor(private noteRangeMax, private grid: Grid, private styles: StyleSettings) {
    this.group = new Konva.Group({
      id: 'background-guides-group'
    });
    this.buildNoteGuides()
  }

  private buildNoteGuides() {
    for (let i = 0; i < this.grid.numRows; i++) {
      let keyColor;
      if (Note.isBlackKey(this.noteRangeMax - i)) {
        keyColor = this.styles.noteGuideBlackColor;
      }
      else {
        keyColor = this.styles.noteGuideWhiteColor;
      }
      let guideRect = new Konva.Rect({
        x: 0,
        y: this.grid.cellHeight * i,
        width: this.grid.getPixelWidth(),
        height: this.grid.cellHeight,
        fill: keyColor,
        listening: false
      });
      this.group.add(guideRect);
    }
  }

  public addToLayer(layer) {
    layer.add(this.group);
  }
}
