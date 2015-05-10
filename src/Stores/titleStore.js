import titleActions from '../Actions/titleActions.js';

export default Reflux.createStore({
  init() {
    this.defaultTitle = this.title = 'Bahnhofs Abfahrten';
  },
  listenables: [titleActions],
  onResetTitle() {
    this.setTitle(this.defaultTitle);
  },
  onChangeTitle(title) {
    this.setTitle(title);
  },
  setTitle(title) {
    this.title = title;
    this.trigger(this.title);
  }
});
