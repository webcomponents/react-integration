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

function getDefaultProps (properties) {
  let defaults = {};
  Object.keys(properties).forEach(function (p) {
    defaults[p] = properties[p].default;
  });
  return defaults;
}

export default function (CustomElement, opts = {}) {
  const React = opts.React || window.React;
  const ReactDOM = opts.ReactDOM || window.ReactDOM;
  const container = opts.container || 'div';
  const defaultProps = getDefaultProps(CustomElement.properties);

  const ReactClass = React.createClass({
    getDefaultProps() {
      return defaultProps;
    },
    render () {
      return React.createElement(container);
    },
    renderChildren (props) {
      // Render the component in the new tree
      ReactDOM.render(React.createElement(container, null, props.children), this._realCustomElement);

      // Passes on all non-react-special props to the custom element.
      setCustomElementProps(this._realCustomElement, props);
    },
    componentDidMount () {
      const props = this.props;

      // The real custom element is the component that we want to contain the
      // new render tree as its content.
      this._realCustomElement = CustomElement(makeCustomElementProps(props));

      // Listen for custom element changes and cancel them to make a stateless component
      this._realCustomElement.addEventListener('property-change', function (e) {
        if (props.handlePropertyChange) {
          props.handlePropertyChange(e, props);
          e.preventDefault();
        }
      });

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
