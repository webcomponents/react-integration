# React Integration

Converts web components into React components so that you can use them as first class citizens in your React components.

- Web components become lexically scoped so you can use them as tag names in JSX.
- Listen for custom events triggered from web components declaratively using the standard `on*` syntax.
- Passes React `props` to web components as properties instead of attributes.
- Works with any web component library that uses a standard native custom element constructor, not just Skate or native web components.
- Also supports custom elements that have been loaded using HTML imports, as well as type-extension elements.

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

// You can also Reactify it using the tag name.
export default reactify('my-component');
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

### Reactifying web components loaded using HTML import
Custom elements that depend on HTML imports (which are described in another part of the Web Components specification) were previously a bit trickier to integrate into a React project. But this `react-integration` library combined with [the `web-components` Webpack loader](https://github.com/rnicholus/web-components-loader) make the process farily painless. After integrating the Webpack loader into your project, simply `import` the root HTML file of the web component in your React component and use the generated URL to import the Web component using an HTML import in your `render` method. For example:

```jsx
import React, { Component } from 'react'

import reactify from 'skatejs-react-integration'

const importWcUrl = require('my-web-component/component.html')

class MyWebComponentWrapper extends Component {
  render() {
    const MyComponent = reactify('my-web-component')

    return (
      <span>
          <link rel='import' href={ importWcUrl } />
          <MyComponent />
      </span>
    )
  }
}

export default MyWebComponentWrapper
```

### Web component attributes
If the underlying web component you intend to Reactify requires some properties to be set directly on the element as attributes, include an `attr-` prefix on the property name. For example:

```jsx
<MyComponent attr-data-fo='bar' />
```

The above code will set a `data-foo` attribute on the underlying custom element, instead of setting a corresponding property on the element object. An example of such a web component is [the hugely popular `<x-gif>` element](https://github.com/geelen/x-gif), which requires the GIF `src` to be set as an element and _not_ a property.

### Type-extension elements
Custom elements that extend an existing native element are also supported. Take [the ajax-form element](https://github.com/rnicholus/ajax-form) as an example. Ajax-form extends the native `<form>` element to provide additional features. This is an example of a type-extension element. In order to use any type-extension element, such as ajax-form, your render method might look something like this:

```jsx
render() {
  const Form = reactify('form')
  
  return (
    <span>
      <link rel='import' href={ ajaxFormImportUrl } />
      <Form attr-action='/user' 
            is='ajax-form' 
            attr-method='POST' 
            onSubmit={ this.props.onSubmit }
      >
        <input name='name' value={ this.props.username } />
        <input name='address' value={ this.props.address } />
        <button>Submit</button>
      </Form>
    </span>
  )
}
```

Notice that the above example also makes use of attribute and HTML imported elemenent support, both of which are discussed earlier in the documentation.

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

### Injecting React and ReactDOM

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
