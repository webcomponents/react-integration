import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

describe('prop-types', () => {
  it('children', () => {
    const Comp = reactify(document.registerElement('x-prop-types-1'), { React, ReactDOM });
    expect(Comp.propTypes.children).to.equal(React.PropTypes.any);
  });
});
