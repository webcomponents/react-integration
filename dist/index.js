// src/index.js
(typeof window === 'undefined' ? global : window).__7aa341a515742184b2b68a0547410aea = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  function setCustomElementProps(customElement, props) {
    Object.keys(props).forEach(function (key) {
      if (key !== 'children') {
        customElement.setAttribute(key, props[key]);
      }
    });
  }
  
  exports['default'] = function (CustomElement) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  
    opts.containerTagName = opts.containerTagName || 'div';
    opts.contentProperty = opts.contentProperty || 'content';
  
    var React = opts.React || window.React;
    var ReactDOM = opts.ReactDOM || window.ReactDOM;
  
    return React.createClass({
      render: function render() {
        return React.createElement('div');
      },
      renderChildren: function renderChildren(props) {
        // Create the React render tree on the content node.
        ReactDOM.render(React.createElement('div', null, props.children), this._realContentNode);
  
        // Apply the new content to the custom element and let it handle it.
        this._realCustomElement[opts.contentProperty] = this._realContentNode;
  
        // Passes on all non-react-special props to the custom element.
        setCustomElementProps(this._realCustomElement, props);
      },
      componentDidMount: function componentDidMount() {
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
      componentWillReceiveProps: function componentWillReceiveProps(props) {
        this.renderChildren(props);
      }
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/global.js
(typeof window === 'undefined' ? global : window).__a34542194e5f1a6324f8d741378a0e51 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _index = __7aa341a515742184b2b68a0547410aea;
  
  var _index2 = _interopRequireDefault(_index);
  
  window.skateReactIntegration = _index2['default'];
  
  return module.exports;
}).call(this);