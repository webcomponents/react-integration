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
    const comp = ReactDOM.render(<Comp onTest={() => count++} />, window.fixture);

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
    // ontest should be just a normal prop
    const comp = ReactDOM.render(<Comp ontest={func} onTest={func} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should preserve declared casing', done => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-4', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('testThis'));
          },
        },
      }),
    }), { React, ReactDOM });

    const func = () => ++count;

    const comp = ReactDOM.render(<Comp ontestThis={func} onTestThis={func} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should handle dashes correctly', done => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-5', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('test-this'));
          },
        },
      }),
    }), { React, ReactDOM });

    const func = () => ++count;

    const comp = ReactDOM.render(<Comp ontest-This={func} onTest-this={func} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(1);
      done();
    }, 1);
  });

  it('should not treat `once` prop as an event', done => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-6', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new CustomEvent('ce'));
          },
        },
      }),
    }), { React, ReactDOM });

    const func = () => ++count;

    const comp = ReactDOM.render(<Comp once={func} />, window.fixture);

    setTimeout(() => {
      ReactDOM.findDOMNode(comp).trigger();
      expect(count).to.equal(0);
      done();
    }, 1);
  });
});
