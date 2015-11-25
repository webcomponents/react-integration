# React Integration

Use Custom Elements in your React components without resorting to hacks.

## Why

For whatever reason you want to be able to use Custom Elements within your React components and be able to pass content to the Custom Elements. For example:

```js
const CustomElement = document.registerElement('custom-element', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback () {
      // Just going to remove the elements but it's likely one would template
      // the elements and if it moves them, it would have the same effect.
      this.innerHTML = '';
    }
  })
});

const ReactComponent = React.createClass({
  render () {
    return (
      <div>
        <custom-element>
          <div>
            <AnotherReactComponent />
          </div>
        </custom-element>
      </div>
    );
  }
});
```

When `<custom-eleent>` removes its content, React loses track of the nodes it originally rendered and throws an error when the state changes.

## How

To get around this, we supply a function that will wrap the custom element in a React component that creates a new diff tree. This method is based on a React Training post by Ryan Florence about [Portals](https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md#portals).

The convention is this:

- Call a function passing in your custom element constructor.
- The React component passes the real DOM node of the new render tree to a property.
- You do the rest.


### Static example

The following example simply takes the `content` property value and renders it inside a div.

```js
import reactify from 'skatejs-react-integration';

const CustomElement = skate('custom-element', {
  render: function (elem) {
    const div = document.createElement('div');
    div.appendChild(elem.content);
    elem.appendChild(div);
  }
});

export default reactify(CustomElement);
```


### Updating example

This will not update if the state changes, however. To do that we need to define a setter for the `content` property.

```js
skate('custom-element', {
  properties: {
    content: {
      set (elem, data) {
        const container = elem.children[0];
        const reactTree = data.newValue;
        container.innerHTML = '';
        if (reactTree) {
          container.appendChild(reactTree);
        }
      }
    }
  },
  render: function (elem) {
    const div = document.createElement('div');
    div.appendChild(elem.content);
    elem.appendChild(div);
  }
});
```

You'll notice that since the diff tree ends in the ancestor tree of `<custom-element>` and the new tree begins at the React tree that was passed in to `content`, we are smashing the DOM at the `container` level. For smaller components this may not matter, but if your component is expecting updates then it'd be good to take accessibility and DOM performance into consideration.


### Diffing example

In order to diff and patch the real DOM tree, we'll need something that can work with real DOM, not vDOM. In the next example we'll use [skatejs-dom-diff](https://github.com/skatejs/dom-diff).

```js
skate('custom-element', {
  properties: {
    content: {
      set: skate.render
    }
  },
  render: skateDomDiff.render(function (elem) {
    const div = document.createElement('div');
    div.appendChild(elem.content);
    return div;
  })
});
```

What's nice about using `skatejs-dom-diff` is that it also works with virtual DOM (or a mixture of both) and it comes with a light-weight virtual DOM interface bundled with it. If you wanted to use the previous example with JSX, all you'd need to do is the following.

```js
skate('custom-element', {
  properties: {
    content: {
      set: skate.render
    }
  },
  render: skateDomDiff.render(function (elem, React) {
    return <div>{elem.content}</div>;
  })
});
```
