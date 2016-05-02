import camelCase from 'camel-case';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import reactify from '../src/index';
import skate from 'skatejs';
import helperElement from 'skatejs/test/lib/element';

function afterMutations (fn) {
  setTimeout(fn, 100);
}

describe('react-integration;', function () {
  let fixture;

  beforeEach(function () {
    fixture = document.createElement('div');
    document.body.appendChild(fixture);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(fixture);
    fixture.innerHTML = '';
    document.body.removeChild(fixture);
  });


  function getWebComponent (tagName) {
    return document.querySelector(tagName);
  }

  function wrapInReact (webComponentConstructor) {
    return reactify(webComponentConstructor, {
      React: React,
      ReactDOM: ReactDOM
    });
  }



  function renderApp(App) {
    App.displayName = 'App';
    return ReactDOM.render(<App />, fixture);
  }

  describe('(React > React wrapped terminal web component);', function () {
    describe('that has an attribute;', function () {
      function makeReactComponent (tagName) {
        const webComponentConstructor = skate(tagName, {
          render: function (elem) {
            elem.innerHTML = '<em><input />' + elem.text + '</em>';
          },
          properties: {
            text: {
              attribute: true,
              set: function (elem) {
                skate.render(elem);
              }
            }
          }
        });

        return wrapInReact(webComponentConstructor);
      }

      const tagName = helperElement('x-terminal-text').safe;
      const ReactComponent = makeReactComponent(tagName);

      it('the web component renders correctly', function () {
        renderApp(
          React.createClass({
            render: function () {
              return <ReactComponent/>;
            }
          })
        );

        expect(getWebComponent(tagName).firstChild.tagName).to.equal('EM');
      });

      it('the react component renders props through the attribute', function () {
        const webComponentText = 'terminal component';

        renderApp(
          React.createClass({
            render: function () {
              return <ReactComponent text={webComponentText}/>;
            }
          })
        );

        expect(getWebComponent(tagName).firstChild.textContent).to.equal(webComponentText);
      });

      it('changing the state changes the web component attribute', function () {
        var renderedApp = renderApp(
          React.createClass({
            getInitialState: function () {
              return {
                text: 'initial text'
              };
            },
            render: function () {
              return <ReactComponent text={this.state.text}/>;
            }
          })
        );

        expect(getWebComponent(tagName).firstChild.textContent).to.equal('initial text');
        renderedApp.setState({
          text: 'updated text'
        });
        expect(getWebComponent(tagName).firstChild.textContent).to.equal('updated text');
      });

      it('the react component\'s display is the camel cased version of the tag name', function () {
        expect(camelCase(tagName)).to.equal(ReactComponent.displayName);
      });
    });

    describe('that has a property but not an attribute;', function () {
      function makeReactComponent (tagName) {
        const webComponentConstructor = skate(tagName, {
          render: function (elem) {
            elem.innerHTML = '<div></div>';
            if (elem.hidden) {
              elem.firstChild.setAttribute('aria-hidden', '');
            } else {
              elem.firstChild.removeAttribute('aria-hidden');
            }
          },
          attached: function (elem) {
            elem._hidden_on_attach = elem.hidden;
          },
          properties: {
            hidden: {
              set: function (elem) {
                skate.render(elem);
              }
            }
          }
        });

        return wrapInReact(webComponentConstructor);
      }

      const tagName = helperElement('x-terminal-text').safe;
      const ReactComponent = makeReactComponent(tagName);

      it('the web component renders props through the property', function () {
        renderApp(
          React.createClass({
            render: function () {
              return <ReactComponent hidden={true}/>;
            }
          })
        );

        expect(getWebComponent(tagName).firstChild.hasAttribute('aria-hidden')).to.equal(true);
      });

      it('the web component properties are available on attach', function (done) {
        renderApp(
          React.createClass({
            render: function () {
              return <ReactComponent hidden={true}/>;
            }
          })
        );

        afterMutations(function () {
          expect(getWebComponent(tagName)._hidden_on_attach).to.equal(true);
          done();
        });
      });
    });
  });

  describe('(React > React wrapped container web component', function () {
    function isReactRoot (elem) {
      return elem.hasAttribute('data-reactid') && elem.getAttribute('data-reactid').split('.').length === 2;
    }

    function makeReactComponent (tagName) {
      var webComponentConstructor = skate(tagName, {
        render: function (elem) {
          elem.innerHTML = '<div class="initial-content"></div>';
        }
      });

      return wrapInReact(webComponentConstructor);
    }

    const tagName = helperElement('x-terminal-text').safe;
    const ReactComponent = makeReactComponent(tagName);

    it('> DOM element): content is rendered directly to the container', function () {
      renderApp(
        React.createClass({
          render: function () {
            return (
              <ReactComponent>
                <em id="user-inserted-contents">User inserted contents</em>
              </ReactComponent>
            );
          }
        })
      );

      const componentContents = document.getElementById('user-inserted-contents');
      const reactRoot = componentContents.parentNode;

      expect(ReactTestUtils.isDOMComponent(componentContents)).to.equal(true, 'component contents');
      expect(isReactRoot(reactRoot)).to.equal(true, 'react root');
      expect(reactRoot.parentNode.tagName.indexOf('-')).to.not.equal(-1, 'web component');
    });

    it('> DOM element): properties are passed to the wrapped React component', function () {
      var renderedApp = renderApp(
        React.createClass({
          render: function () {
            return (
              <ReactComponent>
                <em id="user-inserted-contents">{this.props.text}</em>
              </ReactComponent>
            );
          }
        })
      );

      renderedApp.setProps({text: 'initial text'});
      expect(document.getElementById('user-inserted-contents').textContent).to.equal('initial text');
      renderedApp.setProps({text: 'updated text'});
      expect(document.getElementById('user-inserted-contents').textContent).to.equal('updated text');
    });

    it('> React component): properties flow down into the child React component', function () {
      const ContainedReactComponent = React.createClass({
        render: function () {
          return <em id="user-inserted-contents">{this.props.text}</em>;
        }
      });

      var renderedApp = renderApp(
        React.createClass({
          render: function () {
            return (
              <ReactComponent>
                <ContainedReactComponent text={this.props.text}/>
              </ReactComponent>
            );
          }
        })
      );

      renderedApp.setProps({text: 'initial text'});
      expect(document.getElementById('user-inserted-contents').textContent).to.equal('initial text');
      renderedApp.setProps({text: 'updated text'});
      expect(document.getElementById('user-inserted-contents').textContent).to.equal('updated text');
    });

    it('> DOM element): events triggered on the DOM element can be handled on click', function () {
      var clicked = false;
      function handleClick () {
        clicked = true;
      }

      renderApp(
        React.createClass({
          render: function () {
            return (
              <ReactComponent>
                <em onClick={handleClick} id="user-inserted-contents">Click me</em>
              </ReactComponent>
            );
          }
        })
      );

      ReactTestUtils.Simulate.click(document.getElementById('user-inserted-contents'));
      expect(clicked).to.equal(true);
    });
  });
});
