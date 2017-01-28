// @flow
import { Paper } from 'material-ui';
import React from 'react';

type Props = {
  fav: string,
}

export default class FavEntry extends React.Component {
  props: Props;
  static contextTypes = {
    router: React.PropTypes.object,
  };
  transitionTo = () => {
    this.context.router.push(`/${this.props.fav}`);
  };
  render() {
    const station = this.props.fav.replace('%2F', '/');
    return (
      <Paper onClick={this.transitionTo} style={style.fav}>
        <div css={style.station}>{station}</div>
      </Paper>
    );
  }
}

const style = {
  fav: {
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
    cursor: 'pointer',
    fontSize: '3em',
    lineHeight: 1.3,
    marginBottom: 1,
  },
  station: {
    ':hover': {
      backgroundColor: 'rgb(238, 238, 238)',
    },
  },
};
