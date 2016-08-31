import reactify from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

let x = 0;
function createComponentWithOpts(opts) {
  return reactify(document.registerElement(`x-props-${x++}`, {
    prototype: Object.create(HTMLElement.prototype, opts),
  }));
}
function createComponentWithProp(name, done) {
  return createComponentWithOpts({
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
  });
}

describe('props', () => {
  it('should set style (object)', () => {
    const Comp = createComponentWithOpts({});
    ReactDOM.render(<Comp style={{ backgroundColor: 'black', width: 1 }} />, window.fixture);
    const elem = window.fixture.firstChild;
    expect(elem.style.backgroundColor).to.equal('black');
    expect(elem.style.width).to.equal('1px');
  });

  it('should set className', () => {
    const Comp = createComponentWithOpts({});
    ReactDOM.render(<Comp className="test" />, window.fixture);
    const elem = window.fixture.firstChild;
    expect(elem.getAttribute('class')).to.equal('test');
  });

  it('should not set children', () => {
    const Comp = createComponentWithProp('children', () => { throw new Error('set children'); });
    ReactDOM.render(<Comp><div /></Comp>, window.fixture);
  });

  it('should not set events', () => {
    const Comp = createComponentWithProp('oncustomevent', () => { throw new Error('set oncustomevent'); });
    ReactDOM.render(<Comp onCustomevent="test" />, window.fixture);
  });

  it('should not set attributes', () => {
    const Comp = createComponentWithProp('test', elem => expect(elem.hasAttribute('test')).to.equal(false));
    ReactDOM.render(<Comp test="test" />, window.fixture);
  });

  it('should set properties for anything else', () => {
    const Comp = createComponentWithProp('test', (elem, value) => expect(value).to.equal('test'));
    ReactDOM.render(<Comp test="test" />, window.fixture);
  });

  it('should work with rest/spread properties', () => {
    const Comp = createComponentWithProp('test');
    const rest = { style: { color: 'white' }, test: 'test' };
    ReactDOM.render(<Comp className="test" {...rest} />, window.fixture);
    const elem = window.fixture.firstChild;
    expect(elem.getAttribute('class')).to.equal('test');
    expect(elem.style.color).to.equal('white');
    expect(elem.test).to.equal('test');
  });
});
