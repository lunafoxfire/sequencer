import * as Konva from 'konva';
import { Note } from './note';
import { Main } from './main';

export class Sidebar {
  public layer: Konva.Layer;

  constructor(private main: Main){
    this.layer = new Konva.Layer({
      id: 'sidebar-layer'
    });
    this.buildKeys();
  }

  buildKeys(){
    for(let i = 0; i < this.main.grid.numRows; i++){
      let keyColor;
      let activeKeyColor;
      if (Note.isBlackKey(this.main.noteRangeMax - i)){
        keyColor = this.main.styles.blackKeyColor;
        activeKeyColor = this.main.styles.activeBlackKeyColor;
      } else {
        keyColor = this.main.styles.whiteKeyColor;
        activeKeyColor = this.main.styles.activeWhiteKeyColor;
      }
      let keyRect = new Konva.Rect({
        x: 0,
        y: this.main.grid.cellHeight * i,
        height: this.main.grid.cellHeight,
        width: this.main.sidebarWidth,
        fill: keyColor,
        stroke: this.main.styles.blackKeyColor,
        strokeWidth: 1
      });
      keyRect.on('mousedown', (event) => {
        this.clickKey(this.main.noteRangeMax - i, event);
        keyRect.fill(activeKeyColor);
      });

      keyRect.on('mouseup mouseleave', function(){
        keyRect.fill(keyColor);
      });
      this.layer.add(keyRect);
    }
  }

  public addToLayer(layer) {
    layer.add(this.layer);
  }

  clickKey(number, event){
    let noteToPlay = Note.getPitchAsString(number);
    this.main.synth.triggerAttackRelease(noteToPlay, '8n');
  }
}
