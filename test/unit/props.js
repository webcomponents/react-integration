import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;
function createComponent(name, done) {
  return reactify(document.registerElement(`x-props-${x++}`, {
    prototype: Object.create(HTMLElement.prototype, {
      [name]: {
        get() {
          return 'test';
        },
        set(value) {
          if (done) {
            done(this, value);
          }
        },
      },
    }),
  }));
}

describe('props', () => {
  it('should not set children', () => {
    const Comp = createComponent('children', () => { throw new Error('set children'); });
    ReactDOM.render(<Comp><div /></Comp>, window.fixture);
  });

  it('should not set events', () => {
    const Comp = createComponent('oncustomevent', () => { throw new Error('set oncustomevent'); });
    ReactDOM.render(<Comp oncustomevent="test" />, window.fixture);
  });

  it('should not set attributes', () => {
    const Comp = createComponent('test', elem => expect(elem.hasAttribute('test')).to.equal(false));
    ReactDOM.render(<Comp test="test" />, window.fixture);
  });

  it('should set properties for anything else', () => {
    const Comp = createComponent('test', (elem, value) => expect(value).to.equal('test'));
    ReactDOM.render(<Comp test="test" />, window.fixture);
  });
});
