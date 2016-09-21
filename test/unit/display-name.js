import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

describe('display-name', () => {
  it('should be a PasalCased version of the tagName', () => {
    const Comp = reactify(document.registerElement('x-display-name-1', {
      prototype: Object.create(HTMLElement.prototype),
    }), { React, ReactDOM });
    ReactDOM.render(React.createElement(Comp), window.fixture);
    expect(Comp.displayName).to.equal('XDisplayName_1');
  });
});
