// @flow
import React from 'react';
import classnames from 'classnames';
import cxs from 'cxs/monolithic';
import Prefixer from 'inline-style-prefixer';
import { flattenDeep, isEmpty, compact } from 'lodash';

const prefixer = new Prefixer();

export const prefixStyles = (styles: Object) => prefixer.prefix(styles);

export const transformProps = ({
  css,
  className,
  ...rest
}: {
  css?: Object|Object[],
  className?: string,
  rest?: any,
} = {}) => {
  if (!css) {
    return {
      className,
      ...rest,
    };
  }

  let combinedCss;
  if (Array.isArray(css)) {
    const compactCss = compact(css);
    if (isEmpty(compactCss)) {
      return {
        className,
        ...rest,
      };
    }
    combinedCss = Object.assign({}, ...flattenDeep(compactCss));
  } else {
    combinedCss = css || {};
  }

  const cx = classnames(cxs(prefixStyles(combinedCss)), className);

  return {
    ...rest,
    className: cx,
  };
};


global.cxsReact = (tag: any, originalProps: any, ...children: any) => {
  let props;
  if (!originalProps || (typeof tag !== 'string' && tag.keepRawCSS)) {
    props = originalProps;
  } else {
    props = transformProps(originalProps);
  }

  return React.createElement(tag, props, ...children);
};

global.cxsReactClone = (tag: any, originalProps: any, ...children: any) => {
  const props = transformProps(originalProps);
  return React.cloneElement(tag, props, ...children);
};
