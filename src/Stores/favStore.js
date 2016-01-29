/* @flow */
import { Map } from 'immutable';
import EventEmitter from 'eventemitter3';
import _ from 'lodash';

const localStorageKey = 'favs';

class FavStore extends EventEmitter {
  list = Map();
  constructor() {
    super();
    const rawList = localStorage.getItem(localStorageKey);
    if (rawList) {
      const loadedList = JSON.parse(rawList);
      if (loadedList) {
        _.each(loadedList, (fav, station) => {
          this.list = this.list.set(station, fav);
        });
        this.emit('fav', this.list.toJS());
      }
    }
  }
  fav(station: Station) {
    this.updateList(this.list.set(station, true));
  }
  unfav(station: Station) {
    this.updateList(this.list.remove(station));
  }
  favButton(button: any) {
    this.emit('favButton', button);
  }
  isFaved(station: Station): bool {
    return this.list.has(station);
  }
  getAll(): Array<any> {
    return this.list.toJS();
  }
  updateList(list: Map) {
    this.list = list;
    localStorage.setItem(localStorageKey, JSON.stringify(list.toJS()));
    this.emit('fav', list.toJS());
  }
}

export default new FavStore();
