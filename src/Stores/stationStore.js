/* @flow */
import _ from 'lodash';
import rawStations from '../codes';

const stations: Array<Station> = rawStations.map((station) => ({
  label: station.name,
  value: station.DS100,
}));
import { filter } from 'fuzzaldrin';

export default {
  getAll(): Array<Station> {
    return stations;
  },
  getIndexed(): {[key: string]: Station} {
    const indexedStations = {};
    stations.forEach(s => {
      indexedStations[s.label] = s;
    });
    return indexedStations;
  },
  getFilteredOptions(input: any): Array<Station> {
    const result = [];
    filter(stations, input, { key: 'label' }).some((station, index) => {
      result.push(station);
      return index > 7;
    });
    return _.sortBy(result, r => !_.includes(r.label.toLowerCase(), 'hbf'));
  },
};
