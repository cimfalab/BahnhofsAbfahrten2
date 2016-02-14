/* @flow */
import _ from 'lodash';

const stations: Array<Station> = require('../BahnhofCode.json').map(station => ({
  label: station.name,
  value: station.code,
}));
import { filter } from 'fuzzaldrin';


export default {
  getAll(): Array<Station> {
    return stations;
  },
  getIndexed(): {[key: string]: string} {
    const indexedStations = {};
    stations.forEach(s => {
      indexedStations[s.label] = s.value;
    });
    return indexedStations;
  },
  getFilteredOptions(input: any): Array<any> {
    const result = [];
    filter(stations, input, { key: 'label' }).some((station, index) => {
      result.push(station);
      return index > 7;
    });
    return _.sortBy(result, r => !_.includes(r.label.toLowerCase(), 'hbf'));
  },
};
