// @flow
import React from 'react';
import createAnimation from '../createAnimaton';

export default class Loading extends React.Component {
  render() {
    return (
      <div css={style.spinner}>
        <div css={style.bounce}/>
        <div css={[style.bounce, style.bounce2]}/>
      </div>
    );
  }
}


const bounce = createAnimation({
  '0%': {
    transform: 'scale(0)',
  },
  '50%': {
    transform: 'scale(1)',
  },
  '100%': {
    transform: 'scale(0)',
  },
}, 'bounce');

const style = {
  spinner: {
    height: 80,
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 80,
  },
  bounce: {
    animation: '2s infinite ease-in-out',
    animationName: bounce,
    backgroundColor: '#333',
    borderRadius: '50%',
    height: '100%',
    left: 0,
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bounce2: {
    animationDelay: '-1s',
  },
};
