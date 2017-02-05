import assign from 'object-assign';
import pascalCase from 'pascal-case';
import React from 'react';
import ReactDOM from 'react-dom';

const defaults = {
  React,
  ReactDOM,
};

function syncEvent(node, eventName, newEventHandler) {
  const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
  const eventStore = node.__events || (node.__events = {});
  const oldEventHandler = eventStore[eventNameLc];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventNameLc, oldEventHandler);
  }

  // Bind new listener.
  if (newEventHandler) {
    node.addEventListener(eventNameLc, eventStore[eventNameLc] = function handler(e) {
      newEventHandler.call(this, e);
    });
  }
}

export default function (CustomElement, opts) {
  opts = assign({}, defaults, opts);
  if (typeof CustomElement !== 'function') {
    throw new Error('Given element is not a valid constructor');
  }
  const tagName = (new CustomElement()).tagName;
  const displayName = pascalCase(tagName);
  const { React, ReactDOM } = opts;

  if (!React || !ReactDOM) {
    throw new Error('React and ReactDOM must be dependencies, globally on your `window` object or passed via opts.');
  }

  class ReactComponent extends React.Component {
    static get displayName() {
      return displayName;
    }
    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(props) {
        const node = ReactDOM.findDOMNode(this);
        Object.keys(props).forEach(name => {
            if (name === 'children' || name === 'style') {
                return;
            }

            const value = props[name];

            if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
                syncEvent(node, name.substring(2), value);
            } else if (name.indexOf('attrs') === 0 && value && typeof value === 'object') {
              Object.keys(value).forEach(attrName => {
                  const attrValue = value[attrName];

                  node.setAttribute(attrName, attrValue);
              })
            } else {
                node[name] = props[name];
            }
        });
    }
    render() {
      return React.createElement(
          tagName,
          {
            is: this.props.is,
            style: this.props.style
          },
          this.props.children
      );
    }
  }

  const proto = CustomElement.prototype;
  Object.getOwnPropertyNames(proto).forEach(prop => {
    Object.defineProperty(ReactComponent.prototype, prop, Object.getOwnPropertyDescriptor(proto, prop));
  });

  return ReactComponent;
}
