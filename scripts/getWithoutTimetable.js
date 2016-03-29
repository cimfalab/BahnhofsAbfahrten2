// @flow
import '../src/babelHelper';
import axios from 'axios';
import stations from '../src/codes';

const filteredStations = [];
console.log('[');
Promise.all(stations.filter(s => s.DS100.startsWith('X')).map(s => {
  return axios.get(`https://marudor.de/api/${s.DS100}`, {
    params: {
      mode: 'marudor',
      backend: 'iris',
      version: 2,
    },
  }).then(result => {
    console.error(`Data for ${s.DS100}`)
    if (!result.data.error || result.data.error !== `The station '${s.DS100}' has no associated timetable`) {
      console.log(`${JSON.stringify(s)}, `);
    }
  });
})).then(() => {
  console.log(']');
})
