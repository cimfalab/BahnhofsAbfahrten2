/* @flow */
import { Map } from 'immutable';
import EventEmitter from 'eventemitter3';
import _ from 'lodash';

const localStorageKey = 'favs';

class FavStore extends EventEmitter {
  list: Map<string, bool> = Map();
  constructor() {
    super();
    const rawList = localStorage.getItem(localStorageKey);
    if (rawList) {
      const loadedList = JSON.parse(rawList);
      if (loadedList) {
        _.each(loadedList, (fav: bool, station: string) => {
          this.list = this.list.set(station, fav);
        });
        this.emit('fav', this.list.toJS());
      }
    }
  }
  fav(station: string) {
    this.updateList(this.list.set(station, true));
  }
  unfav(station: string) {
    this.updateList(this.list.remove(station));
  }
  favButton(button: any) {
    this.emit('favButton', button);
  }
  isFaved(station: string): bool {
    return this.list.has(station);
  }
  getAll(): Map<string, bool> {
    return this.list;
  }
  updateList(list: Map<string, bool>) {
    this.list = list;
    localStorage.setItem(localStorageKey, JSON.stringify(list.toJS()));
    this.emit('fav', list.toJS());
  }
}

export default new FavStore();
