/* @flow */

import stationStore from './stationStore.js';
import { List } from 'immutable';
import axios from 'axios';
import EventEmitter from 'eventemitter';

class AbfahrtStore extends EventEmitter {
  list = List()
  indexedStations = stationStore.getIndexed()
  constructor() {
    super();
  }
  removeAbfahrt(abfahrt) {
    const [key] = this.list.findEntry(v => v === abfahrt);
    if (key) {
      this.updateList(this.list.remove(key));
    }
  }
  async requestAbfahrten(station) {
    station = this.indexedStations[station] || station;
    const abfahrten = await axios.get(`http://dbf.finalrewind.org/${station}`, {
      params: {
        mode: 'marudor',
        backend: 'iris',
        version: 1,
      },
    });
    if (abfahrten.error) {
      this.error(abfahrten.error);
    } else {
      this.receiveAbfahrten(abfahrten.departures);
    }
  }
  error(error) {
    this.emit('error', error);
  }
  receiveAbfahrten(abfahrten) {
    this.list = this.list.clear();
    _.each(abfahrten, abfahrt => {
      this.list = this.list.push(abfahrt);
    });
    this.emit('abfahrten', this.list.toJS());
  }
  clearAbfahrten() {
    this.updateList(this.list.clear());
  }
  updateList(list) {
    this.list = list;
    this.emit('abfahrten', this.list.toJS());
  }
}

export default new AbfahrtStore();
