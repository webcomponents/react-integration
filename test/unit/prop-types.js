import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

describe('prop-types', () => {
  it('accepts propTypes', () => {
    const Comp = reactify(document.registerElement('x-prop-types-1'), { React, ReactDOM });
    Comp.propTypes = {
      someRequiredAttr: React.PropTypes.string
    };
    expect(Comp.propTypes.someRequiredAttr).to.equal(React.PropTypes.string);
  });
});
