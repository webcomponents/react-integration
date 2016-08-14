import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;
function createComponent() {
  const proto = Object.create(HTMLElement.prototype);
  proto.foo = function() {
    return 'bar';
  };
  return reactify(document.registerElement(`x-webcomponent-proto-funcs-${x++}`, {
    prototype: proto,
  }), { React, ReactDOM });
}

describe('Webcomponent prototype functions', () => {
  it('should be callable on React component', () => {
    const Comp = createComponent();

    expect(Comp.prototype.foo()).to.equal('bar');
  });
});
