(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'camel-case'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('camel-case'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.camelCase);
    global.index = mod.exports;
  }
})(this, function (module, exports, _camelCase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (CustomElement) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var React = opts.React || window.React;
    var ReactDOM = opts.ReactDOM || window.ReactDOM;
    var container = opts.container || 'div';
    var content = opts.property || 'content';
    var ReactClass = React.createClass({
      render: function render() {
        return React.createElement(container);
      },
      renderChildren: function renderChildren(props) {
        // Apply the new content to the custom element and let it handle it.
        this._realCustomElement[content] = props.children;

        // Passes on all non-react-special props to the custom element.
        setCustomElementProps(this._realCustomElement, props);
      },
      componentDidMount: function componentDidMount() {
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

    ReactClass.displayName = (0, _camelCase2.default)(CustomElement.id);

    return ReactClass;
  };

  var _camelCase2 = _interopRequireDefault(_camelCase);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function setCustomElementProps(customElement, props) {
    Object.keys(props).forEach(function (key) {
      if (key !== 'children') {
        customElement[key] = props[key];
      }
    });
  }

  module.exports = exports['default'];
});