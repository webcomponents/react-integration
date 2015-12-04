import camelCase from 'camel-case';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import reactify from '../src/index';
import skate from 'skatejs';
import helperElement from 'skatejs/test/lib/element';

describe('react-integration;', function () {
    var fixture;

    beforeEach(function () {
        fixture = document.createElement('div');
        document.body.appendChild(fixture);
    });

    afterEach(function () {
        ReactDOM.unmountComponentAtNode(fixture);
        fixture.innerHTML = '';
        document.body.removeChild(fixture);
    });

    var tagName;

    function getWebComponent () {
        return document.querySelector(tagName);
    }

    function makeReactComponent (webComponentConstructor) {
        var ReactComponent = reactify(webComponentConstructor, {
            React: React,
            ReactDOM: ReactDOM
        });

        return ReactComponent;
    }

    function renderApp(App) {
        App.displayName = 'App';
        return ReactDOM.render(<App />, fixture);
    }

    describe('with a terminal web component;', function () {
        describe('that has an attribute;', function () {
            var ReactComponent;

            beforeEach(function () {
                tagName = helperElement('x-terminal-text').safe;
                var webComponentConstructor = skate(tagName, {
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

                ReactComponent = makeReactComponent(webComponentConstructor);
            });

            it('the web component renders correctly', function () {
                renderApp(
                    React.createClass({
                        render: function () {
                            return <ReactComponent/>;
                        }
                    })
                );

                expect(getWebComponent().firstChild.tagName).to.equal('EM');
            });

            it('the react component renders props through the attribute', function () {
                const WEB_COMPONENT_TEXT = 'terminal component';

                renderApp(
                    React.createClass({
                        render: function () {
                            return <ReactComponent text={WEB_COMPONENT_TEXT}/>;
                        }
                    })
                );

                expect(getWebComponent().firstChild.textContent).to.equal(WEB_COMPONENT_TEXT);
            });

            it('changing the state changes the web component attribute', function () {
                var renderedApp = renderApp(
                    React.createClass({
                        getInitialState: function () {
                            return {
                                text: 'initial text'
                            }
                        },
                        render: function () {
                            return <ReactComponent text={this.state.text}/>;
                        }
                    })
                );

                expect(getWebComponent().firstChild.textContent).to.equal('initial text');
                renderedApp.setState({
                    text: 'updated text'
                });
                expect(getWebComponent().firstChild.textContent).to.equal('updated text');
            });

            it('the react component\'s display is the camel cased version of the tag name', function () {
                expect(camelCase(tagName)).to.equal(ReactComponent.displayName);
            });
        });

        describe('that has a property but not an attribute;', function () {
            var ReactComponent;

            beforeEach(function () {
                tagName = helperElement('x-terminal-hidden').safe;
                var webComponentConstructor = skate(tagName, {
                    render: function (elem) {
                        elem.innerHTML = '<div></div>';
                        if (elem.hidden) {
                            elem.firstChild.setAttribute('aria-hidden', '');
                        } else {
                            elem.firstChild.removeAttribute('aria-hidden');
                        }
                    },
                    properties: {
                        hidden: {
                            set: function (elem) {
                                skate.render(elem);
                            }
                        }
                    }
                });

                ReactComponent = makeReactComponent(webComponentConstructor)
            });

            it('the web component renders props through the property', function () {
                renderApp(
                    React.createClass({
                        render: function () {
                            return <ReactComponent hidden="true"/>;
                        }
                    })
                );

                expect(getWebComponent().firstChild.hasAttribute('aria-hidden')).to.be.true;
            });
        });
    });

    describe('with a container web component;', function () {

        function isReactRoot (elem) {
            return elem.hasAttribute('data-reactid') && elem.getAttribute('data-reactid').split('.').length === 2;
        }

        beforeEach(function () {
            tagName = helperElement('x-container').safe;
            var webComponentConstructor = skate(tagName, {
                render: function (elem) {
                    elem.innerHTML = '<div class="parent"><div class="content"></div></div>';
                },
                properties: {
                    content: {
                        get: function content (elem) {
                            return elem.querySelector('.content').firstChild;
                        },

                        set: function content (elem, changeData) {
                            const container = elem.querySelector('.content');
                            const reactTree = changeData.newValue;
                            container.innerHTML = '';
                            if (reactTree) {
                                container.appendChild(reactTree);
                            }
                        }
                    }
                }
            });

            ReactComponent = makeReactComponent(webComponentConstructor);
        });

        it('that contains a DOM element: content is redirected to the correct container', function () {
            renderApp(
                React.createClass({
                    render: function () {
                        return <ReactComponent>
                            <em id="user-inserted-contents">User inserted contents</em>
                        </ReactComponent>;
                    }
                })
            );

            const componentContents = document.getElementById('user-inserted-contents');
            const reactRoot = componentContents.parentNode;
            const reactRootContainer = reactRoot.parentNode;
            const webComponentContent = reactRootContainer.parentNode;

            expect(ReactTestUtils.isDOMComponent(componentContents)).to.equal(true, 'component contents');
            expect(isReactRoot(reactRoot)).to.equal(true, 'react root');
            expect(reactRootContainer.tagName).to.equal('DIV', 'react root container');
            expect(webComponentContent.className).to.equal('content', 'web component content');
        });

        it('that contains a DOM element: properties are passed to the wrapped React component', function () {
            var renderedApp = renderApp(
                React.createClass({
                    render: function () {
                        return <ReactComponent>
                            <em id="user-inserted-contents">{this.props.text}</em>
                        </ReactComponent>;
                    }
                })
            );

            renderedApp.setProps({text: 'initial text'});
            expect(document.getElementById('user-inserted-contents').textContent).to.equal('initial text');
            renderedApp.setProps({text: 'updated text'});
            expect(document.getElementById('user-inserted-contents').textContent).to.equal('updated text');
        });

        it('that contains another React component: properties flow down into the child React component', function () {
            const ContainedReactComponent = React.createClass({
                render: function () {
                    return <em id="user-inserted-contents">{this.props.text}</em>
                }
            });

            var renderedApp = renderApp(
                React.createClass({
                    render: function () {
                        return <ReactComponent>
                            <ContainedReactComponent text={this.props.text}/>
                        </ReactComponent>;
                    }
                })
            );

            renderedApp.setProps({text: 'initial text'});
            expect(document.getElementById('user-inserted-contents').textContent).to.equal('initial text');
            renderedApp.setProps({text: 'updated text'});
            expect(document.getElementById('user-inserted-contents').textContent).to.equal('updated text');
        });

        it('that contains a DOM element: events triggered on the DOM element can be handled outside the component', function () {
            var clicked = false;
            function handleClick () {
                clicked = true;
            }

            var RC = React.createClass({
                render: function () {
                    return <div></div>
                }
            });

            var renderedApp = renderApp(
                React.createClass({
                    render: function () {
                        return <div>
                            <ReactComponent onClick={handleClick}>
                                <em id="user-inserted-contents">{this.props.text}</em>
                            </ReactComponent>
                        </div>;
                    }
                })
            );

            ReactTestUtils.Simulate.click(document.getElementById('user-inserted-contents'));
            expect(clicked).to.equal(true);
        });
    });
});
