// @flow
import { Paper } from 'material-ui';
import { setDetail } from '../Actions/abfahrten';
import React from 'react';
import MidAbfahrt from './MidAbfahrt';
import EndAbfahrt from './EndAbfahrt';

type Props = {abfahrt: Abfahrt, detail: boolean};

export default class AbfahrtEntry extends React.PureComponent {
  props: Props;

  onClick = () => {
    if (this.props.detail) {
      setDetail(null);
    } else {
      setDetail(this.props.abfahrt);
    }
  };
  render() {
    const { abfahrt, detail } = this.props;
    const cancel = abfahrt.isCancelled;
    const entryStyle = style.entry;
    return (
      <Paper key="a" style={style.wrapper} onClick={this.onClick} zIndex={1}>
        <div css={entryStyle}>
          <div css={[style.train, cancel && style.cancelled]}>
            {abfahrt.train}
          </div>
          <MidAbfahrt abfahrt={abfahrt} detail={detail} />
          <EndAbfahrt abfahrt={abfahrt} detail={detail} />
        </div>
      </Paper>
    );
  }
}

const style = {
  wrapper: {
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
    cursor: 'pointer',
    flexShrink: 0,
    marginBottom: 5,
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 15,
  },
  entry: {
    display: 'flex',
    flexShrink: 0,
    fontSize: '0.6em',
    lineHeight: 1,
    paddingTop: 5,
    userSelect: 'none',
    '@media screen and (max-width: 1200px)': { fontSize: '0.3em' },
  },
  cancelled: { textDecoration: 'line-through' },
  train: {
    flex: 1,
    fontSize: '3em',
    lineHeight: 1.2,
    maxWidth: 280,
    '@media screen and (max-width: 1200px)': { maxWidth: 75 },
  },
};
