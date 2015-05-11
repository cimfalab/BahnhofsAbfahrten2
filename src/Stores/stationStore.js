const stations = require('../BahnhofCode.json');

export default class {
  static getAll() {
    return stations;
  }
  static getNames() {
    return _.map(stations, s => s.name);
  }
  static getIndexed() {
    var indexedStations = {};
    _.each(stations, s => {
      indexedStations[s.name] = s.code;
    });
    return indexedStations;
  }
}
