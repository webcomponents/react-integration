import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

describe('custom events', () => {
  let count;

  function inc() {
    ++count;
  }

  beforeEach(() => {
    count = 0;
  });

  it('should bind built-in events', done => {
    const Comp = reactify(document.registerElement('x-custom-event-1', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('click'));
          },
        },
      }),
    }), { React, ReactDOM });
    const comp = ReactDOM.render(<Comp onclick={inc} onClick={inc} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should bind custom events', done => {
    const Comp = reactify(document.registerElement('x-custom-event-2', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('testing'));
          },
        },
      }),
    }), { React, ReactDOM });
    const comp = ReactDOM.render(<Comp ontesting={inc} onTestIng={inc} />, window.fixture);
    
    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should not duplicate handlers', done => {
    const Comp = reactify(document.registerElement('x-custom-event-3', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('testing'));
          },
        },
      }),
    }), { React, ReactDOM });

    const func = () => ++count;

    // Using both ontest and onTest (case-sensitive) test case-sensitivity.
    const comp = ReactDOM.render(<Comp ontesting={func} onTestIng={func} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });
});
