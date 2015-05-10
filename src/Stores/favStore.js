import favActions from '../Actions/favActions.js';
import { Map } from 'immutable';

const localStorageKey = 'favs';

export default Reflux.createStore({
  init() {
    this.list = Map();
    const loadedList = JSON.parse(localStorage.getItem(localStorageKey));
    if (loadedList) {
      _.each(loadedList, (fav, station) => {
        this.list = this.list.set(station, fav);
      });
      this.trigger(this.list.toJS());
    }
  },
  listenables: [favActions],
  onFav(station) {
    this.updateList(this.list.set(station, true));
  },
  onUnfav(station) {
    this.updateList(this.list.remove(station));
  },
  onFavButton(button) {
    this.emitter.emit('favButton', button);
  },
  isFaved(station) {
    return this.list.has(station);
  },
  getAll() {
    return this.list.toJS();
  },
  updateList(list) {
    this.list = list;
    localStorage.setItem(localStorageKey, JSON.stringify(list.toJS()));
    this.trigger(list.toJS());
  }
});
