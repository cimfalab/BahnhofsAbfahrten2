import titleActions from '../Actions/titleActions.js';
import favActions from '../Actions/favActions.js';
import Reflux from 'reflux';

export default Reflux.createStore({
  init() {
    this.defaultTitle = this.title = 'Bahnhofs Abfahrten';
  },
  listenables: [titleActions],
  onResetTitle() {
    this.setTitle(this.defaultTitle);
    favActions.favButton(null);
  },
  onChangeTitle(title) {
    this.setTitle(title);
  },
  onRevertTitle() {
    this.setTitle(this.oldTitle);
  },
  setTitle(title) {
    this.oldTitle = this.title;
    this.title = title;
    this.trigger(this.title);
  }
});
