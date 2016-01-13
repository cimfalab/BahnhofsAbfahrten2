import EventEmitter from 'eventemitter';
import favStore from './favStore.js';
import React from 'react';

const titleStyle = {
  whiteSpace: 'nowrap',
  color: 'rgba(255, 255, 255, 0.87)',
  flex: 1,
  fontSize: 24,
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: '64px',
  margin: 0,
  overflow: 'hidden',
  paddingTop: 0,
  textOverflow: 'ellipsis',
};

class TitleStore extends EventEmitter {
  resetTitle() {
    this.setTitle(this.defaultTitle);
    favStore.favButton(null);
  }
  changeTitle(title) {
    this.setTitle(title);
  }
  revertTitle() {
    this.setTitle(this.oldTitle);
  }
  setTitle(title) {
    this.oldTitle = this.title;
    this.title = title;
    this.emit('title', this.title);
  }
  openInput = () => {
    this.emit('openInput');
  };
  getTitle(title) {
    return (
      <h1 style={titleStyle} onClick={this.openInput}>{title}</h1>
    );
  }
  defaultTitle = this.getTitle('Bahnhofs Abfahrten');
  title = this.defaultTitle;
}

export default new TitleStore();
