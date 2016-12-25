import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;

function createComponent() {
  const tagName = `x-attributes-${x++}`;

  return {
    constructor: document.registerElement(tagName, {
      prototype: Object.create(HTMLElement.prototype),
    }),
    tagName: tagName
  };
}

function getReactifiedComponentByConstructor() {
  return reactify(createComponent().constructor);
}

function getReactifiedComponentByTagName() {
  return reactify(createComponent().tagName);
}

describe('attributes', () => {
  it('should pass on properties that start with "attr-" as attributes', () => {
    const Comp = getReactifiedComponentByConstructor();
    const comp = ReactDOM.render(<Comp attr-data-test='test-data'/>, window.fixture);
    expect(ReactDOM.findDOMNode(comp).getAttribute('data-test')).to.equal('test-data');
  });

  it('should pass on properties that start with "attr-" as attributes using tagName based reactification', () => {
    const Comp = getReactifiedComponentByTagName();
    const comp = ReactDOM.render(<Comp attr-data-test='test-data'/>, window.fixture);
    expect(ReactDOM.findDOMNode(comp).getAttribute('data-test')).to.equal('test-data');
  });
});
