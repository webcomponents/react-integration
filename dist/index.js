// node_modules/camelcase/index.js
(typeof window === 'undefined' ? global : window).__16de26c1767b78cf0117c39b315b4f07 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  module.exports = function () {
  	var str = [].map.call(arguments, function (str) {
  		return str.trim();
  	}).filter(function (str) {
  		return str.length;
  	}).join('-');
  
  	if (!str.length) {
  		return '';
  	}
  
  	if (str.length === 1 || !(/[_.\- ]+/).test(str) ) {
  		if (str[0] === str[0].toLowerCase() && str.slice(1) !== str.slice(1).toLowerCase()) {
  			return str;
  		}
  
  		return str.toLowerCase();
  	}
  
  	return str
  	.replace(/^[_.\- ]+/, '')
  	.toLowerCase()
  	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
  		return p1.toUpperCase();
  	});
  };
  
  
  return module.exports;
}).call(this);
// src/index.js
(typeof window === 'undefined' ? global : window).__33e1b544e80a0fd100d25f6ec4f002ef = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _camelcase = __16de26c1767b78cf0117c39b315b4f07;
  
  var _camelcase2 = _interopRequireDefault(_camelcase);
  
  function makeCustomElementProps(props) {
    var customElementProps = {};
    Object.keys(props).forEach(function (key) {
      if (key !== 'children') {
        customElementProps[key] = props[key];
      }
    });
  
    return customElementProps;
  }
  
  function setCustomElementProps(customElement, props) {
    Object.keys(props).forEach(function (key) {
      if (key !== 'children') {
        customElement[key] = props[key];
      }
    });
  }
  
  exports['default'] = function (CustomElement) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  
    opts.containerTagName = opts.containerTagName || 'div';
    opts.contentProperty = opts.contentProperty || 'content';
  
    var React = opts.React || window.React;
    var ReactDOM = opts.ReactDOM || window.ReactDOM;
  
    var ReactClass = React.createClass({
      displayName: 'ReactClass',
  
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
        this._realCustomElement = CustomElement(makeCustomElementProps(this.props));
  
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
  
    ReactClass.displayName = (0, _camelcase2['default'])(CustomElement.id);
  
    return ReactClass;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/global.js
(typeof window === 'undefined' ? global : window).__70dc37d5a75c923c928d3e7477cb22bb = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _index = __33e1b544e80a0fd100d25f6ec4f002ef;
  
  var _index2 = _interopRequireDefault(_index);
  
  window.skateReactIntegration = _index2['default'];
  
  return module.exports;
}).call(this);