import React from 'react';
import Radium from 'radium';

const bounce = Radium.keyframes({
  '0%': {
    transform: 'scale(0)'
  },
  '50%': {
    transform: 'scale(1)'
  },
  '100%': {
    transform: 'scale(0)'
  }
});

@Radium
export default class Loading extends React.Component {
  static style = {
    spinner: {
      height: 80,
      left: '50%',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 80
    },
    bounce: {
      animation: `${bounce} 2s infinite ease-in-out`,
      backgroundColor: '#333',
      borderRadius: '50%',
      height: '100%',
      left: 0,
      opacity: '0.6',
      position: 'absolute',
      top: 0,
      width: '100%'
    },
    bounce2: {
      animationDelay: '-1s'
    }
  }
  render() {
    const style = Loading.style;
    return (
      <div style={style.spinner}>
        <div style={style.bounce}></div>
        <div style={[style.bounce, style.bounce2]}></div>
      </div>
    );
  }
}