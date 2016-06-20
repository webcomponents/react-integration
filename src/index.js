import assign from 'object-assign';

function makeStateless(comp, node, props, opts) {
  const propChangeHandler = props[opts.propChangeHandler];
  node.addEventListener(opts.propChangeEvent, function (e) {
    if (propChangeHandler) {
      propChangeHandler.call(comp, e);
      e.preventDefault();
    }
  });
}

function syncEvent(node, eventName, newEventHandler) {
  const eventStore = node.__events || (node.__events = {});
  const oldEventHandler = eventStore[eventName];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler);
  }

  // Bind new listener.
  if (newEventHandler) {
    node.addEventListener(eventName, eventStore[eventName] = function (e) {
      newEventHandler.call(this, e);
    });
  }
}

const defaults = {
  propChangeEvent: 'prop-change',
  propChangeHandler: 'propChangeHandler',
  React: window.React,
  ReactDOM: window.ReactDOM
};

export default function(CustomElement, opts) {
  opts = assign(defaults, opts);
  const displayName = (new CustomElement()).tagName;
  const { React, ReactDOM } = opts;

  return React.createClass({
    displayName,
    render() {
      return React.createElement(displayName, null, this.props.children);
    },
    componentDidMount() {
      const node = ReactDOM.findDOMNode(this);
      const props = this.props;
      makeStateless(this, node, props, opts);
      this.componentWillReceiveProps(props);
    },
    componentWillReceiveProps(props) {
      const node = ReactDOM.findDOMNode(this);
      Object.keys(props).forEach(name => {
        if (name === 'children') {
          return;
        }

        if (name.indexOf('on') === 0) {
          syncEvent(node, name.substring(2), props[name]);
        } else {
          node[name] = props[name];
        }
      });
    }
  });
}
