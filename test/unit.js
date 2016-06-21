import './unit/children';
import './unit/custom-events';
import './unit/display-name';
import './unit/prop-types';
import './unit/props';

beforeEach(() => {
  document.body.appendChild(window.fixture = document.createElement('div'));
});

afterEach(() => {
  document.body.innerHTML = '';
});
