// @flow
import { createAction } from 'redux-actions';
import { List } from 'immutable';
import axios from 'axios';

export const fetchAbfahrten = createAction('FETCH_ABFAHRTEN', async (station: Station) => {
  try {
    const abfahrten: {
      error?: any,
      departures: Abfahrt[],
    } = (await axios.get(`/api/abfahrten/${station.id}`)).data;
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

export const setSelectedStation = createAction('SET_SELECTED_STATION');

export const setDetail = createAction('SET_DETAIL');

export const clearAbfahrten = createAction('FETCH_ABFAHRTEN', () => null);
