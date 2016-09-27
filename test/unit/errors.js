import reactify from '../../src/index';

describe('prop-types', () => {
  const msg = 'or passed via opts.';

  it('no custom element', () => {
      expect(() => reactify()).to.throw('Given element is not a valid constructor');
  });

  it('no react', () => {
    expect(() => reactify(document.registerElement('x-errors-1'), { React: null })).to.throw(msg);
    expect(() => reactify(document.registerElement('x-no-errors-1'))).to.not.throw(msg);
  });

  it('no react-dom', () => {
    expect(() => reactify(document.registerElement('x-errors-2'), { ReactDOM: null })).to.throw(msg);
    expect(() => reactify(document.registerElement('x-no-errors-2'))).to.not.throw(msg);
  });
});
