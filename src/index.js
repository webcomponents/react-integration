import camelCase from 'camel-case';

function makeCustomElementProps (props) {
  let customElementProps = {};
  Object.keys(props).forEach(function (key) {
    if (key !== 'children') {
      customElementProps[key] = props[key];
    }
  });

  return customElementProps;
}

function setCustomElementProps (customElement, props) {
  Object.keys(makeCustomElementProps(props)).forEach(function (key) {
    customElement[key] = props[key];
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
      // Create the React render tree on the content node.
      ReactDOM.render(React.createElement(container, null, props.children), this._realContentNode);

      // Apply the new content to the custom element and let it handle it.
      this._realCustomElement[content] = this._realContentNode;

      // Passes on all non-react-special props to the custom element.
      setCustomElementProps(this._realCustomElement, props);
    },
    componentDidMount () {
      // The real content node is the node that will act as the new React
      // render tree and will house the children.
      this._realContentNode = document.createElement(container);

      // The real custom element is the component that we want to contain the
      // new render tree as its content.
      this._realCustomElement = CustomElement(makeCustomElementProps(this.props));

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
