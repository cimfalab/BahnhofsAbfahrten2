// @flow
import React from 'react';

type Props = {abfahrt: Abfahrt, detail: boolean};

export default ({ abfahrt, detail }: Props) => (
  <div css={style.time}>
    {
      detail ? [
        abfahrt.scheduledArrival && (
          <div key="a">
            An: {abfahrt.scheduledArrival}
          </div>
        ),
        abfahrt.scheduledDeparture && (
          <div key="d">
            Ab: {abfahrt.scheduledDeparture}
          </div>
        ),
      ] : <div>
      {abfahrt.scheduledDeparture || abfahrt.scheduledArrival}
    </div>
  }
</div>
);

const style = { time: { fontSize: '2.4em' } };
