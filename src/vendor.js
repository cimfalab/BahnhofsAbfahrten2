global.React = require('react');
global.When = require('when');
global.Promise = global.When.Promise;
global.axios = require('axios');
global.Reflux = require('reflux');
global._ = require('lodash');
global.classNames = require('classnames');
require('./main.less');

function getAllMethods(obj) {
  return Object.getOwnPropertyNames(obj)
  .filter(key => _.isFunction(obj[key]));
}

global.autoBind = function(obj) {
  getAllMethods(obj.constructor.prototype)
  .forEach(mtd => {
    obj[mtd] = obj[mtd].bind(obj);
  });
};
