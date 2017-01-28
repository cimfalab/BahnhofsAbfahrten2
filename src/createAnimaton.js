// @flow
import { sheet, hyphenate, addPx } from 'cxs/monolithic';
import { forEach } from 'lodash';

export default (spec: Object, name: string) => {
  let result = '';
  forEach(spec, (css, step) => {
    let cssString = '';
    forEach(css, (val, key) => {
      cssString = `${cssString}${hyphenate(key)}:${addPx(key, val)};`;
    });
    result = `${result}${step} {${cssString}}`;
  });
  sheet.insert(`@keyframes ${name} { ${result} }`);
  return name;
};
