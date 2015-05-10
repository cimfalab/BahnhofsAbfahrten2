import abfahrtActions from '../Actions/abfahrtActions.js';
import { OrderedMap } from 'immutable';


const localStorageKey = 'abfahrten';
var counter = 0;

export default Reflux.createStore({
  init() {
    const loadedList = localStorage.getItem(localStorageKey);
    this.list = OrderedMap();
    if (loadedList) {
      _.each(loadedList, item => {
        this.list = this.list.set(counter++, item);
      });
    }
  },
  listenables: [abfahrtActions],
  onAddAbfahrt(abfahrt) {
    this.updateList(this.list.set(counter++, abfahrt));
  },
  onRemoveAbfahrt(abfahrt) {
    const [key, item] = this.list.findEntry(v => v === abfahrt);
    if (key) {
      this.updateList(this.list.remove(key));
    }
  },
  onRequestAbfahrten(station) {
    axios.get(`https://dbf.finalrewind.org/${station}`, {
      params: {
        mode: 'marudor',
        backend: 'iris',
        version: 1
      }
    }).then(abfahrten => {
      abfahrtActions.receiveAbfahrten(abfahrten.data.departures);
    });
  },
  onReceiveAbfahrten(abfahrten) {
    this.list = this.list.clear();
    _.each(abfahrten, abfahrt => {
      this.list = this.list.set(counter++, abfahrt);
    });
    this.trigger(this.list.toJS());
  },
  onClearAbfahrten() {
    this.updateList(this.list.clear());
  },
  updateList(list) {
    localStorage.setItem(localStorageKey, list.toJSON());
    this.list = list;
    this.trigger(this.list.toJS());
  }
});
