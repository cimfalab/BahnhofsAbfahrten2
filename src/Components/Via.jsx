// @flow
import React from 'react';

type Props = {
  abfahrt: Abfahrt,
  detail: bool,
}

function normalizeName(name: string) {
  let normalizedName = name.replace(/([^ ])\(/, '$1 (');
  normalizedName = name.replace(/\)(.)/, ') $1');
  normalizedName = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');
  return normalizedName;
}

function getAbfahrt(
  name: string,
  index: number,
  length: number,
  abfahrt: Abfahrt,
  isCancelled?: ?number,
  isAdditional?: ?number,
): Array<any> {
  const via = [];
  const lowerName = name.toLowerCase();
  const isHbf = lowerName.includes('hbf') ||
    lowerName.includes('centraal') ||
    lowerName.includes('centrale') ||
    lowerName.includes('termini');
  via.push(
    <span
      key={`${index}i`}
      css={[
        isCancelled && style.cancelled,
        isAdditional && style.additional,
        isHbf && style.hbf,
      ]}>
      {normalizeName(name)}
    </span>,
  );
  if (index + 1 !== length) {
    via.push(<span key={index}> - </span>);
  }
  return via;
}

function getInfo(abfahrt: Abfahrt) {
  let info = '';
  if (abfahrt.messages.delay.length > 0) {
    info += abfahrt.messages.delay[0].text;
  }
  abfahrt.messages.qos.forEach(q => {
    if (info.length > 0) {
      info += ' +++ ';
    }
    info += q.text;
  });
  for (let i = 1; i < abfahrt.messages.delay.length; i++) {
    info += ` +++ ${abfahrt.messages.delay[i].text}`;
  }
  return info ? <div key="i" css={style.info}>{info}</div> : null;
}

function getNormalVia(abfahrt: Abfahrt): Array<any> {
  let via = [];
  const abfahrten = abfahrt.via;
  abfahrten.forEach((v, index) => {
    via = via.concat(
      getAbfahrt(v, index, abfahrten.length, abfahrt, abfahrt.isCancelled),
    );
  });
  return via;
}

function getDetailedVia(abfahrt: Abfahrt): Array<any> {
  let via = [];
  const abfahrten = abfahrt.route;
  abfahrten.forEach((v, index) => {
    via = via.concat(
      getAbfahrt(
        v.name,
        index,
        abfahrten.length,
        abfahrt,
        v.isCancelled || abfahrt.isCancelled,
        v.isAdditional,
      ),
    );
  });
  return via;
}

export default ({ abfahrt, detail }: Props) => {
  const via = detail ? getDetailedVia(abfahrt) : getNormalVia(abfahrt);
  const info = getInfo(abfahrt);
  return (
    <div css={[style.via, abfahrt.isCancelled && style.cancelled]}>
      {info}
      {(detail || !info) && via}
    </div>
  );
};

const style = {
  info: {
    textDecoration: 'none',
    color: 'red',
    overflow: 'hidden',
  },
  cancelled: { textDecoration: 'line-through' },
  via: {
    fontSize: '2.1em',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  additional: { color: 'red' },
  hbf: { fontWeight: 'bold' },
};
