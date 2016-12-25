import reactify from '../../src/index';

let x = 0;
function createComponent() {
  const tagName = `x-webcomponent-proto-funcs-${x++}`;
  return {
    constructor: document.registerElement(tagName, {
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
    }),
    tagName: tagName
  };
}

function getReactifiedComponentByConstructor() {
  return reactify(createComponent().constructor);
}

function getReactifiedComponentByTagName() {
  return reactify(createComponent().tagName);
}


describe('Webcomponent prototype functions', () => {
  it('should be callable on React component', () => {
    const Comp = getReactifiedComponentByConstructor();
    expect(Comp.prototype.foo()).to.equal('bar');
  });

  it('should return prop', () => {
    const Comp = getReactifiedComponentByConstructor();
    expect(Comp.prototype.getProp()).to.equal('prop');
  });

  it('should not invoke getters', () => {
    // If this functionality fails, calling createComponent() should cause the error to be thrown.
    const Comp = getReactifiedComponentByConstructor();

    // We expect it to throw here to make sure we've written our test correctly.
    expect(() => Comp.prototype.getter).to.throw();
  });
});

describe('Webcomponent prototype functions - reactified with tagName', () => {
  it('should be callable on React component', () => {
    const Comp = getReactifiedComponentByTagName();
    expect(Comp.prototype.foo()).to.equal('bar');
  });

  it('should return prop', () => {
    const Comp = getReactifiedComponentByTagName();
    expect(Comp.prototype.getProp()).to.equal('prop');
  });

  it('should not invoke getters', () => {
    // If this functionality fails, calling createComponent() should cause the error to be thrown.
    const Comp = getReactifiedComponentByTagName();

    // We expect it to throw here to make sure we've written our test correctly.
    expect(() => Comp.prototype.getter).to.throw();
  });
});
