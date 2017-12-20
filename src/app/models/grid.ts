import * as Konva from 'konva';

export class Grid {
  private group: Konva.Group;
  constructor(
    public cellWidth: number,
    public cellHeight: number,
    public numCols: number,
    public numRows: number,
    public gridColor: string
  ) {
    this.buildGridKonvaGroup();
  }

  public getPixelHeight() {
    return this.cellHeight * this.numRows;
  }
  public getPixelWidth() {
    return this.cellWidth * this.numCols;
  }

  public addToLayer(layer) {
    layer.add(this.group);
  }

  private buildGridKonvaGroup() {
    this.group = new Konva.Group({
      id: 'grid-group'
    });
    let numVertLines = this.numCols + 1;
    let numHorizLines = this.numRows + 1;
    for (let i = 0; i <= numVertLines; i++) {
      let lineWidth = (i % 8 === 0) ? 4 : (i % 4 === 0) ? 2 : 1;
      let line = new Konva.Line({
        points: [this.cellWidth * i, 0, this.cellWidth * i, this.getPixelHeight()],
        stroke: this.gridColor,
        strokeWidth: lineWidth
      });
      this.group.add(line);
    }
    for (let j = 1; j <= numHorizLines; j++) {
      let line = new Konva.Line({
        points: [0, this.cellHeight * j, this.getPixelWidth(), this.cellHeight * j],
        stroke: this.gridColor,
        strokeWidth: 1
      });
      this.group.add(line);
    }
  }
}
