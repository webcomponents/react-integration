//This only works because we're transpiling ES6 modules. There's an implicit dependency between setup and react-wc-tests
//We need this because we need to set up a global on the window *before* react starts initialising, but we cannot modify
//react to depend on the setup code. The alternate solution is to modify the build so that the setup isn't necessary.
import './setup';
import './react-wc-tests';