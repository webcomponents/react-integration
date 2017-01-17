# React Integration

Converts web components into React components so that you can use them as first class citizens in your React components.

- Web components become lexically scoped so you can use them as tag names in JSX.
- Listen for custom events triggered from web components declaratively using the standard `on*` syntax.
- Passes React `props` to web components as properties instead of attributes.
- Works with any web component library that uses a standard native custom element constructor, not just Skate or native web components.

## Usage

Web components are converted to React components simply by passing them to the main react-integration function:

```js
import reactify from 'skatejs-react-integration';

// Create your constructor.
const MyComponent = class MyComponent extends HTMLElement {};

// Define your custom element.
const CustomElement = window.customElements.define('my-component', MyComponent);

// Reactify it!
export default reactify(CustomElement);
```

Usage with [SkateJS](https://github.com/skatejs/skatejs) is pretty much the same, Skate just makes defining your custom element easier:

```js
import reactify from 'skatejs-react-integration';

export default reactify(skate('my-component', {}));
```

### Lexical scoping

When you convert a web component to a React component, it returns the React component. Therefore you can use it in your JSX just like any other React component.

```js
const ReactComponent = reactify(WebComponent);
ReactDOM.render(<ReactComponent />, container);
```

### Custom events

Out of the box, React only works with built-in events. By using this integration layer, you can listen for custom events on a web component.

```js
// in MyComponent
var event = new Event('customevent');
elem.dispatchEvent(event);

// after reactified
<ReactComponent onCustomevent={handler} />
```

Now when `customevent` is emitted from the web component, your `handler` on `ReactComponent` will get triggered.

### Web component properties

When you pass down props to the web component, instead of setting attributes like React normally does for DOM elements, it will set all `props` as properties on your web component. This is useful because you can now pass complex data to your web components.

```js
// reactified component
<ReactComponent items={[ 'item1', 'item2' ]} callback={function() {}} />

// in MyComponent
<MyComponent items={elem.items} callback={elem.callback} />
```

### Children

If your web component renders content to itself, make sure you're using Shadow DOM and that you render it to the shadow root. If you do this `children` and props get passed down as normal and React won't see your content in the shadow root.

### `ref`

If you need access the the underlying DOM element, you can use the standard [`ref` API](https://facebook.github.io/react/docs/more-about-refs.html). Beware that since you're dealing with a React Component, you'll need to use [`ReactDOM.findDOMNode`](https://facebook.github.io/react/docs/top-level-api.html#reactdom.finddomnode):

```js
import ReactDOM from 'react-dom';
const ReactComponent = reactify(class WebComponent extends HTMLElement {});

class MyComponent extends Component {
  constructor() {
    super();
    this.webComponent = null;
  }
  
  render() {
    return (
      <ReactComponent
        ref={reactComponent => { 
          this.webComponent = ReactDOM.findDOMNode(reactComponent);
        }}
      />
    );
  }
}
```

### Injecting `React` and `ReactDOM`

By default, the React integration will import `React` and `ReactDOM` via `peerDependencies`. However, you can override this by passing your own versions:

```js
import reactify from 'skatejs-react-integration';
import React from 'my-custom-react';
import ReactDOM from 'my-custom-react-dom';

class WebComponent extends HTMLElement {}
const ReactComponent = reactify(WebComponent, { React, ReactDOM });
```

### Multiple React versions

The integration sets a peer-dependency on React so you know what it's compatible with. That said, you still need to be mindful that the version of React you provide to the integration layer is correct.
