import EventEmitter from 'eventemitter';
import favStore from './favStore.js';

class TitleStore extends EventEmitter {
  defaultTitle = 'Bahnhofs Abfahrten'
  title = 'Bahnhofs Abfahrten'
  resetTitle() {
    this.setTitle(this.defaultTitle);
    favStore.favButton(null);
  }
  changeTitle(title) {
    this.setTitle(title);
  }
  revertTitle() {
    this.setTitle(this.oldTitle);
  }
  setTitle(title) {
    this.oldTitle = this.title;
    this.title = title;
    this.emit('title', this.title);
  }
}

export default new TitleStore();
