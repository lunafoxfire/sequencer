import * as Konva from 'konva';
import { Grid } from './grid';

export class Playhead {
  private position: number = 0;
  private rectangle: Konva.Rect;

  constructor(public grid: Grid, public color: string) {
    this.rectangle = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: this.grid.getPixelHeight(),
      fill: this.color,
      opacity: 0.5,
      listening: false,
      visible: true
    });
  }

  public setPosition(position: number) {
    this.position = position;
    this.rectangle.width(position);
  }

  public addToLayer(layer) {
    layer.add(this.rectangle);
  }
}
