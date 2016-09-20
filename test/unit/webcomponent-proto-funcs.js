import reactify from '../../src/index';

let x = 0;
function createComponent() {
  return reactify(document.registerElement(`x-webcomponent-proto-funcs-${x++}`, {
    prototype: Object.create(HTMLElement.prototype, {
      prop: {
        value: 'prop',
      },
      foo: {
        value() {
          return 'bar';
        },
      },
      getProp: {
        value() {
          return this.prop;
        },
      },
      getter: {
        get() {
          throw new Error('should not throw when reactifying');
        },
      },
    }),
  }));
}

describe('Webcomponent prototype functions', () => {
  it('should be callable on React component', () => {
    const Comp = createComponent();
    expect(Comp.prototype.foo()).to.equal('bar');
  });

  it('should return prop', () => {
    const Comp = createComponent();
    expect(Comp.prototype.getProp()).to.equal('prop');
  });

  it('should not invoke getters', () => {
    // If this functionality fails, calling createComponent() should cause the error to be thrown.
    const Comp = createComponent();

    // We expect it to throw here to make sure we've written our test correctly.
    expect(() => Comp.prototype.getter).to.throw();
  });
});
