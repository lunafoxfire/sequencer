import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SequencerPageComponent } from './sequencer-page/sequencer-page.component';
import { IndexPageComponent } from './index-page/index-page.component';

import { routing } from './app.routing';
import { SequencerComponent } from './sequencer/sequencer.component';

@NgModule({
  declarations: [
    AppComponent,
    SequencerPageComponent,
    IndexPageComponent,
    SequencerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
