import * as Konva from 'konva';
import { Note } from './note';
import { Grid } from './grid';

export class Sidebar {
  public sidebarLayer: Konva.Layer;

  constructor(public maxNote: number, public sidebarWidth: number, private grid: Grid, private synth){
    this.sidebarLayer = new Konva.Layer({
      id: 'sidebar-layer'
    });
    this.buildKeys();
  }

  buildKeys(){
    for(let i = 0; i < this.grid.numRows; i++){
      let keyColor;
      if (Note.isBlackKey(this.maxNote - i)){
        keyColor = 'black';
      } else {
        keyColor = 'white';
      }
      let keyRect = new Konva.Rect({
        x: 0,
        y: this.grid.cellHeight * i,
        height: this.grid.cellHeight,
        width: this.sidebarWidth,
        fill: keyColor,
        stroke: 'black',
        strokeWidth: 1
      });
      keyRect.on('mousedown', () => {
        this.clickKey(this.maxNote - i);
        keyRect.fill('yellow');
      });

      keyRect.on('mouseup mouseleave', function(){
        keyRect.fill(keyColor);
      });
      this.sidebarLayer.add(keyRect);
    }
  }

  // delete this
  getSideLayer(){
    this.buildKeys();
    return this.sidebarLayer;
  }

  public addToLayer(layer) {
    layer.add(this.sidebarLayer);
  }

  clickKey(number){
    let noteToPlay = Note.convertNumToString(number);
    this.synth.triggerAttackRelease(noteToPlay, '8n');
  }


}
