/* @flow */

import stationStore from './stationStore.js';
import { List } from 'immutable';
import axios from 'axios';
import EventEmitter from 'eventemitter3';


class AbfahrtStore extends EventEmitter {
  list: List<Abfahrt> = List();
  indexedStations = stationStore.getIndexed();
  removeAbfahrt(abfahrt: any) {
    const [key] = this.list.find(v => v === abfahrt);
    if (key) {
      this.updateList(this.list.remove(key));
    }
  }
  async requestAbfahrten(station: string) {
    const stationObject = this.indexedStations[station];
    const abfahrten: {
      error?: any,
      departures: Abfahrt[],
    } = await axios.get(`/api/${stationObject.value}`, {
      params: {
        mode: 'marudor',
        backend: 'iris',
        version: 2,
      },
    });
    if (abfahrten.error) {
      this.error(abfahrten.error);
    } else {
      this.receiveAbfahrten(abfahrten.departures);
    }
  }
  error(error: any) {
    this.emit('error', error);
  }
  receiveAbfahrten(abfahrten: Abfahrt[]) {
    this.list = this.list.clear();
    abfahrten.forEach(abfahrt => {
      this.list = this.list.push(abfahrt);
    });
    this.emit('abfahrten', this.list.toJS());
  }
  clearAbfahrten() {
    this.updateList(this.list.clear());
  }
  updateList(list: List<Abfahrt>) {
    this.list = list;
    this.emit('abfahrten', this.list.toJS());
  }
}

export default new AbfahrtStore();
