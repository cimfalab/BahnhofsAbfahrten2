// @flow
import React from 'react';
import Times from './times';

type Props = {abfahrt: Abfahrt, detail: boolean};


function getDelay(abfahrt: Abfahrt) {
  if ((!abfahrt.delayDeparture && !abfahrt.delayArrival) || abfahrt.isCancelled) {
    return null;
  }
  let delay = abfahrt.delayDeparture || abfahrt.delayArrival;
  if ((abfahrt.delayDeparture || abfahrt.delayArrival) > 0) {
    delay = `+${delay}`;
  } else {
    delay = `-${Math.abs(delay)}`;
  }
  return (
    <span
      css={
        (abfahrt.delayDeparture || abfahrt.delayArrival) > 0
        ? style.delay
        : style.early
      }>
      ({delay})
    </span>
  );
}

export default ({ abfahrt, detail }: Props) => (
  <div css={[style.end, abfahrt.isCancelled && style.cancelled]}>
    <Times abfahrt={abfahrt} detail={detail}/>
    <div>
      {getDelay(abfahrt)}
      <span css={style.platform}>{abfahrt.platform}</span>
    </div>
  </div>
);

const style = {
  end: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  cancelled: { textDecoration: 'line-through' },
  platform: { fontSize: '3em' },
  early: { color: 'green', fontSize: '3em', marginRight: '0.4em' },
  delay: { color: 'red', fontSize: '3em', marginRight: '0.4em' },
};
