import detailActions from '../Actions/detailActions.js';

export default Reflux.createStore({
  listenables: [detailActions],
  onSetDetail(entry) {
    this.trigger(entry);
  }
});
