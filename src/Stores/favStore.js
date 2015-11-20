import { Map } from 'immutable';
import EventEmitter from 'eventemitter';

const localStorageKey = 'favs';

class FavStore extends EventEmitter {
  list = Map()
  constructor() {
    super();
    const loadedList = JSON.parse(localStorage.getItem(localStorageKey));
    if (loadedList) {
      _.each(loadedList, (fav, station) => {
        this.list = this.list.set(station, fav);
      });
      this.emit('fav', this.list.toJS());
    }
  }
  fav(station) {
    this.updateList(this.list.set(station, true));
  }
  unfav(station) {
    this.updateList(this.list.remove(station));
  }
  favButton(button) {
    this.emit('favButton', button);
  }
  isFaved(station) {
    return this.list.has(station);
  }
  getAll() {
    return this.list.toJS();
  }
  updateList(list) {
    this.list = list;
    localStorage.setItem(localStorageKey, JSON.stringify(list.toJS()));
    this.emit('fav', list.toJS());
  }
}

export default new FavStore();
