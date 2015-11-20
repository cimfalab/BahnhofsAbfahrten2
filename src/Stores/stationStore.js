const stations = _.map(require('../BahnhofCode.json'), station => {
  return {
    label: station.name,
    value: station.code,
  };
});
import { filter } from 'fuzzaldrin';


export default class {
  static getAll() {
    return stations;
  }
  static getIndexed() {
    const indexedStations = {};
    _.each(stations, s => {
      indexedStations[s.label] = s.value;
    });
    return indexedStations;
  }
  static getFilteredOptions(input) {
    const result = [];
    _.some(filter(stations, input, { key: 'label' }), (station, index) => {
      result.push(station);
      return index > 7;
    });
    return _.sortBy(result, r => {
      return !_.contains(r.label.toLowerCase(), 'hbf');
    });
  }
}
