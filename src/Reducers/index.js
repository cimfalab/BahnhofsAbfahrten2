// @flow
import { handleActions } from 'redux-actions';
import type { List } from 'immutable';

export default handleActions({
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
}, {
  abfahrten: null,
  error: null,
});
