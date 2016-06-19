/* @flow */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { reduxObservable } from 'redux-observable';
import createLogger from 'redux-logger';

import reducers from './reducers';
import processor from './observables';
import Main from './containers/Main';

const createStoreWithMiddleware = applyMiddleware(
  reduxObservable(processor),
  createLogger()
)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
store.dispatch({ type: 'APP_INIT' });

function Compare() {
  return <Provider store={store}>
    <Main />
  </Provider>;
}

AppRegistry.registerComponent('Compare', () => Compare);
