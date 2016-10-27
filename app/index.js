/* @flow */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import createLogger from 'redux-logger';

import reducers from './reducers';
import epic from './epic';
import Main from './containers/Main';

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(
    createEpicMiddleware(epic),
    createLogger()
  )
);
store.dispatch({ type: 'APP_INIT' });

function Compare() {
  return <Provider store={store}>
    <Main />
  </Provider>;
}

AppRegistry.registerComponent('Compare', () => Compare);
