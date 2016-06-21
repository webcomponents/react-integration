import reactify from '../../src/index';
import React from 'react';

describe('prop-types', () => {
  it('children', () => {
    const Comp = reactify(document.registerElement('x-prop-types-1'));
    expect(Comp.propTypes.children).to.equal(React.PropTypes.any);
  });
});
