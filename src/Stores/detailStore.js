import EventEmitter from 'eventemitter3';

class DetailStore extends EventEmitter {
  setDetail(entry) {
    this.emit('detail', entry);
  }
}

export default new DetailStore();
