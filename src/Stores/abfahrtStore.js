import abfahrtActions from '../Actions/abfahrtActions.js';
import stationStore from './stationStore.js';
import {List} from 'immutable';
import axios from 'axios';
import Reflux from 'reflux';

export default Reflux.createStore({
  init() {
    this.list = List();
    this.indexedStations = stationStore.getIndexed();
  },
  listenables: [abfahrtActions],
  onRemoveAbfahrt(abfahrt) {
    const [key] = this.list.findEntry(v => v === abfahrt);
    if (key) {
      this.updateList(this.list.remove(key));
    }
  },
  onRequestAbfahrten(station) {
    station = this.indexedStations[station] || station;
    axios.get(`http://dbf.finalrewind.org/${station}`, {
      params: {
        mode: 'marudor',
        backend: 'iris',
        version: 1
      }
    }).then(abfahrten => {
      if (abfahrten.data.error) {
        abfahrtActions.error(abfahrten.data.error);
      } else {
        abfahrtActions.receiveAbfahrten(abfahrten.data.departures);
      }
    });
  },
  onError(error) {
    this.emitter.emit('error', error);
  },
  onReceiveAbfahrten(abfahrten) {
    this.list = this.list.clear();
    _.each(abfahrten, abfahrt => {
      this.list = this.list.push(abfahrt);
    });
    this.trigger(this.list.toJS());
  },
  onClearAbfahrten() {
    this.updateList(this.list.clear());
  },
  updateList(list) {
    this.list = list;
    this.trigger(this.list.toJS());
  }
});
