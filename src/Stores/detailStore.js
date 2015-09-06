import EventEmitter from 'eventemitter';

class DetailStore extends EventEmitter {
  setDetail(entry) {
    this.emit('detail', entry);
  }
}

export default new DetailStore();
