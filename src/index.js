import camelCase from 'camel-case';

function setCustomElementProps (customElement, props) {
  Object.keys(props).forEach(function (key) {
    if (key !== 'children') {
      customElement[key] = props[key];
    }
  });
}

export default function (CustomElement, opts = {}) {
  const React = opts.React || window.React;
  const ReactDOM = opts.ReactDOM || window.ReactDOM;
  const container = opts.container || 'div';
  const content = opts.property || 'content';
  const ReactClass = React.createClass({
    render () {
      return React.createElement(container);
    },
    renderChildren (props) {
      // Apply the new content to the custom element and let it handle it.
      this._realCustomElement[content] = props.children;

      // Passes on all non-react-special props to the custom element.
      setCustomElementProps(this._realCustomElement, props);
    },
    componentDidMount () {
      // The real custom element is the component that we want to contain the
      // new render tree as its content.
      this._realCustomElement = new CustomElement();

      // The real portal node is this node which we will be appending the real
      // custom element to.
      this._realPortalNode = ReactDOM.findDOMNode(this);

      // The custom element becomes the content of this node.
      this._realPortalNode.appendChild(this._realCustomElement);

      // Now kick off the rendering of the custom element and react tree.
      this.renderChildren(this.props);
    },
    componentWillReceiveProps (props) {
      this.renderChildren(props);
    }
  });

  ReactClass.displayName = camelCase(CustomElement.id);

  return ReactClass;
}
