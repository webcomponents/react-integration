import assign from 'object-assign';
import pascalCase from 'pascal-case';

const defaults = {
  React: window.React,
  ReactDOM: window.ReactDOM,
};

function syncEvent(node, eventName, newEventHandler) {
  const eventStore = node.__events || (node.__events = {});
  const oldEventHandler = eventStore[eventName];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler);
  }

  // Bind new listener.
  if (newEventHandler) {
    node.addEventListener(eventName, eventStore[eventName] = function handler(e) {
      newEventHandler.call(this, e);
    });
  }
}

export default function (CustomElement, opts) {
  opts = assign(defaults, opts);
  const tagName = (new CustomElement()).tagName;
  const displayName = pascalCase(tagName);
  const { React, ReactDOM } = opts;

  return class extends React.Component {
    static get displayName() {
      return displayName;
    }
    static get propTypes() {
      return {
        children: React.PropTypes.any,
      };
    }
    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }
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
    render() {
      return React.createElement(tagName, null, this.props.children);
    }
  };
}
