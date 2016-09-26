// @flow
/* eslint react/no-danger: 0 */
import { Paper } from 'material-ui';
import Radium from 'radium';
import React from 'react';

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
    display: 'flex',
    justifyContent: 'space-between',
  },
};

@Radium
export default class Spenden extends React.Component {
  render() {
    return (
      <div style={style.wrap}>
        <div style={style.spacer}/>
        <Paper style={style.text}>
          <div>
            Anregungen und Feedback gerne an <a href="mailto:abfahrten@marudor.de">abfahrten@marudor.de</a>
          </div>
        </Paper>
      </div>
    );
  }
}
