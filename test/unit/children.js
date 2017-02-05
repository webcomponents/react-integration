import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;
function createComponent() {
  return reactify(document.registerElement(`x-children-${x++}`, {
    prototype: Object.create(HTMLElement.prototype),
  }), { React, ReactDOM });
}

describe('children', () => {
  it('should pass on children', () => {
    const Comp = createComponent();
    const comp = ReactDOM.render(<Comp><child /></Comp>, window.fixture);
    expect(ReactDOM.findDOMNode(comp).firstChild.tagName).to.equal('CHILD');
  });
});
