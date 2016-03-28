// @flow
/* eslint react/no-danger: 0 */
import { Paper } from 'material-ui';
import Radium from 'radium';
import React from 'react';
import spendenText from '../spenden';

const style = {
  wrap: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
  },
  spacer: {
    flex: '1 1 0',
  },
  text: {
    padding: 10,
  },
};

/*::`*/
@Radium
/*::`*/
export default class Spenden extends React.Component {
  render() {
    return (
      <div style={style.wrap}>
        <div style={style.spacer}/>
        <Paper style={style.text}>
          Du findest die Website Praktisch? Du nutzt sie häufig?
          <br/>
          Ich würde mich über eine Spende freuen!
          <br/>
          <span dangerouslySetInnerHTML={{ __html: spendenText }}></span>
        </Paper>
      </div>
    );
  }
}
