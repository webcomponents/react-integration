import assign from 'object-assign';
import pascalCase from 'pascal-case';
import React from 'react';
import ReactDOM from 'react-dom';

const defaults = {
  React,
  ReactDOM
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
  // Allows to pass the tagName instead of the CustomElement Class
  // Avoids creating an instance of the component just to get the tagName.
  // Makes it possible to use this with Web.Components written in TypeScript.
  var tagName;
  if (typeof CustomElement === 'string') {
    tagName = CustomElement;
    CustomElement = customElements.get(tagName);
    if (!CustomElement) {
      throw new Error('CustomElement ' + tagName + ' not defined.');
    }
  }
  else {
    tagName = new CustomElement().tagName;
  }

  opts = assign(defaults, opts);
  const displayName = pascalCase(tagName);
  const { React, ReactDOM } = opts;

  if (!React || !ReactDOM) {
    throw new Error('React and ReactDOM must be dependencies, globally on your `window` object or passed via opts.');
  }

  class ReactComponent extends React.Component {
    static get displayName() {
      return displayName;
    }
    static get propTypes() {
      return {
        children: React.PropTypes.any,
        style: React.PropTypes.any,
      };
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

        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
          syncEvent(node, name.substring(2), props[name]);
        } else {
          node[name] = props[name];
        }
      });
    }
    render() {
      return React.createElement(tagName, { style: this.props.style }, this.props.children);
    }
  }

  const proto = CustomElement.prototype;
  Object.keys(proto).forEach(prop => {
    if (typeof proto[prop] === 'function') {
      ReactComponent.prototype[prop] = proto[prop].bind(proto);
    }
  });

  return ReactComponent;
}
