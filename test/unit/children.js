import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;

function createComponent() {
  const tagName = `x-children-${x++}`;

  return {
    constructor: document.registerElement(tagName, {
      prototype: Object.create(HTMLElement.prototype),
    }),
    tagName: tagName
  };
}

function getReactifiedComponentByConstructor() {
  return reactify(createComponent().constructor, { React, ReactDOM });
}

function getReactifiedComponentByTagName() {
  return reactify(createComponent().tagName, { React, ReactDOM });
}

describe('children', () => {
  it('should pass on children', () => {
    const Comp = getReactifiedComponentByConstructor();
    const comp = ReactDOM.render(<Comp><child /></Comp>, window.fixture);
    expect(ReactDOM.findDOMNode(comp).tagName).to.match(/^X-CHILDREN/);
    expect(ReactDOM.findDOMNode(comp).firstChild.tagName).to.equal('CHILD');
  });

  it('should pass on children using tagName based reactification', () => {
    const Comp = getReactifiedComponentByTagName();
    const comp = ReactDOM.render(<Comp><child /></Comp>, window.fixture);
    expect(ReactDOM.findDOMNode(comp).tagName).to.match(/^X-CHILDREN/);
    expect(ReactDOM.findDOMNode(comp).firstChild.tagName).to.equal('CHILD');
  });
});
