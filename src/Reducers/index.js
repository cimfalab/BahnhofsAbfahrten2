// @flow
import { handleActions } from 'redux-actions';
import { List, Map } from 'immutable';

const favKey = 'favs';
let favorites = Map();
const rawFavs = localStorage.getItem(favKey);
if (rawFavs) {
  const favs = JSON.parse(rawFavs);
  favorites = Map(favs);
}

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
    const favorites = state.favorites.set(payload, true);
    localStorage.setItem(favKey, JSON.stringify(favorites.toJS()));
    return {
      favorites,
    };
  },
  UNFAV(state, { payload }: { payload: string }) {
    const favorites = state.favorites.delete(payload);
    localStorage.setItem(favKey, JSON.stringify(favorites.toJS()));
    return {
      favorites,
    };
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
  selectedDetail: null,
});
