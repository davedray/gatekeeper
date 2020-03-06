import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Provider } from 'react-redux';
import store from './app/store'

import * as serviceWorker from './serviceWorker';
import { FocusStyleManager } from "@blueprintjs/core";
import {
  BrowserRouter as Router
} from 'react-router-dom';

FocusStyleManager.onlyShowFocusOnTabs();

const render = () => {
  const App = require('./app/App').default;
  ReactDOM.render(
      <Provider store={store}>
          <Router>
            <App />
          </Router>
      </Provider>, document.getElementById('root'));
};


render();

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./app/App', render)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
