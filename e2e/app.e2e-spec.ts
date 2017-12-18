import { SequencerPage } from './app.po';

describe('sequencer App', () => {
  let page: SequencerPage;

  beforeEach(() => {
    page = new SequencerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
