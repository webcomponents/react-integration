import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;
function createComponent() {
  const proto = Object.create(HTMLElement.prototype);
  proto.prop = 'prop';
  proto.foo = function() {
    return 'bar';
  };
  proto.getProp = function() {
    return this.prop;
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

  it('should return prop', () => {
    const Comp = createComponent();

    expect(Comp.prototype.getProp()).to.equal('prop');
  });
});
