import React from 'react';

function setCustomElementProps (customElement, props) {
  Object.keys(props).forEach(function (key) {
    if (key !== 'children') {
      customElement.setAttribute(key, props[key]);
    }
  });
}

export default function (CustomElement, opts = {}) {
  opts.containerTagName = opts.containerTagName || 'div';
  opts.contentProperty = opts.contentProperty || 'content';

  return React.createClass({
    render () {
      return <div />;
    },
    renderChildren (props) {
      // Create the React render tree on the content node.
      ReactDOM.render(<div>{props.children}</div>, this._realContentNode);

      // Apply the new content to the custom element and let it handle it.
      this._realCustomElement[opts.contentProperty] = this._realContentNode;

      // Passes on all non-react-special props to the custom element.
      setCustomElementProps(this._realCustomElement, props);
    },
    componentDidMount () {
      // The real content node is the node that will act as the new React
      // render tree and will house the children.
      this._realContentNode = document.createElement(opts.containerTagName);

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
}
