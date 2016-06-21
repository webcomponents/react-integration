import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

describe('events', () => {
  it('should bind built-in events', () => {
    let count = 0;
    const Comp = reactify(document.registerElement('x-custom-event-1', {
      prototype: Object.create(HTMLElement.prototype, {
        trigger: {
          value() {
            this.dispatchEvent(new MouseEvent('click'));
          },
        },
      }),
    }), { React, ReactDOM });
    const comp = ReactDOM.render(<Comp onclick={() => count++} />, window.fixture);
    ReactDOM.findDOMNode(comp).trigger();
    expect(count).to.equal(1);
  });

  it('should bind custom events', () => {
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
    ReactDOM.findDOMNode(comp).trigger();
    expect(count).to.equal(1);
  });
});
