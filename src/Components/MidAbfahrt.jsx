// @flow
import React from 'react';
import Via from './Via';

function normalizeName(name: string) {
  let normalizedName = name.replace(/([^ ])\(/, '$1 (');
  normalizedName = name.replace(/\)(.)/, ') $1');
  normalizedName = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');
  return normalizedName;
}

type Props = {
  abfahrt: Abfahrt,
  detail: bool,
}

export default ({ abfahrt, detail }: Props) => (
  <div css={[style.mid, detail && style.detail]}>
    <Via abfahrt={abfahrt} detail={detail}/>
    <div css={[style.destination, abfahrt.isCancelled && style.cancelled]}>
      {normalizeName(abfahrt.destination)}
    </div>
  </div>
);

const style = {
  detail: { whiteSpace: 'normal' },
  destination: { fontSize: '4em' },
  cancelled: { textDecoration: 'line-through' },
  mid: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
};
