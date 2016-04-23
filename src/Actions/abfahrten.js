// @flow
import { createAction } from 'redux-actions';
import { List } from 'immutable';
import axios from 'axios';

export const fetchAbfahrten = createAction('FETCH_ABFAHRTEN', async (station: Station) => {
  try {
    const abfahrten: {
      error?: any,
      departures: Abfahrt[],
    } = await axios.get(`/api/${station.value}`, {
      params: {
        mode: 'marudor',
        backend: 'iris',
        version: 2,
      },
    });
    if (abfahrten.error) {
      throw new Error(abfahrten.error);
    }
    return List(abfahrten.departures);
  } catch (e) {
    return {
      error: e.message,
    };
  }
});

export const clearAbfahrten = createAction('FETCH_ABFAHRTEN', () => null);
