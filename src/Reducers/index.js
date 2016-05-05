// @flow
import { handleActions } from 'redux-actions';
import { List, Map } from 'immutable';
import rawStations from '../codes';

const favKey = 'favs';
let favorites = Map();
const rawFavs = localStorage.getItem(favKey);
if (rawFavs) {
  const favs = JSON.parse(rawFavs);
  favorites = Map(favs);
}

const mappedStations = rawStations.map((station) => ({
  label: station.name,
  value: station.DS100,
}));
let stations = Map();
mappedStations.forEach(s => {
  stations = stations.set(s.label, s);
});

export default handleActions({
  SET_SELECTED_STATION(state, { payload }) {
    return {
      selectedStation: payload,
    };
  },
  FETCH_ABFAHRTEN: (state, { payload }: { payload: List<Abfahrt> | { payload: { error: Error } }}) => {
    if (payload && payload.error) {
      return {
        error: payload.error,
      };
    }
    return {
      abfahrten: payload,
      error: null,
    };
  },
  FAV(state, { payload }: { payload: string }) {
    const station: ?Station = state.stations.find((s: Station) => s.value === payload);
    if (station) {
      const favorites = state.favorites.set(station.value, true);
      localStorage.setItem(favKey, JSON.stringify(favorites.toJS()));
      return {
        favorites,
      };
    }
    return state;
  },
  UNFAV(state, { payload }: { payload: string }) {
    const station: ?Station = state.stations.find((s: Station) => s.value === payload);
    if (station) {
      const favorites = state.favorites.delete(station.value);
      localStorage.setItem(favKey, JSON.stringify(favorites.toJS()));
      return {
        favorites,
      };
    }
    return state;
  },
  SET_DETAIL(state, { payload }) {
    return {
      selectedDetail: payload,
    };
  },
}, {
  abfahrten: null,
  error: null,
  favorites,
  stations,
  selectedDetail: null,
});
