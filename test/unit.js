import './unit/children';
import './unit/events';
import './unit/display-name';
import './unit/errors';
import './unit/prop-types';
import './unit/props';
import './unit/webcomponent-proto-funcs';

beforeEach(() => {
  document.body.appendChild(window.fixture = document.createElement('div'));
});

afterEach(() => {
  document.body.innerHTML = '';
});
