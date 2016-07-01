import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

describe('custom events', () => {
  it('should bind built-in events', done => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-1', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('click'));
          },
        },
      }),
    }), { React, ReactDOM });
    const comp = ReactDOM.render(<Comp onClick={() => count++} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should bind custom events', done => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-2', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('test'));
          },
        },
      }),
    }), { React, ReactDOM });
    const comp = ReactDOM.render(<Comp ontest={() => count++} />, window.fixture);
    
    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should not duplicate handlers', done => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-3', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('test'));
          },
        },
      }),
    }), { React, ReactDOM });

    const func = () => ++count;

    // Using both ontest and onTest (case-sensitive) test case-sensitivity.
    const comp = ReactDOM.render(<Comp ontest={func} onTest={func} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });
});
