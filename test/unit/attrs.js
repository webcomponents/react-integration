import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;

function createComponent() {
    const tagName = `x-attributes-${x++}`;

    return document.registerElement(tagName, {
        prototype: Object.create(HTMLElement.prototype),
    })
}

describe('attrs', () => {
    it('should pass on properties that start with "attr-" as attributes', () => {
        const Comp = reactify(createComponent());
        const comp = ReactDOM.render(<Comp attr-data-test='test-data'/>, window.fixture);
        expect(ReactDOM.findDOMNode(comp).getAttribute('data-test')).to.equal('test-data');
    });
});
