/* @flow */
import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { reduxObservable } from 'redux-observable';

import type { Forecast } from '../types';
import Main from './Main';

import reducers from '../reducers';
import processor from '../observables';

const createStoreWithMiddleware = applyMiddleware(
  reduxObservable(processor)
)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
// FIXME:
store.dispatch({ type: 'FUTURE_DATE_CHANGED', payload: store.getState().future.date });
store.dispatch({ type: 'PAST_DATE_CHANGED', payload: store.getState().past.date });
store.dispatch({ type: 'APP_INIT' });

export default function Compare() {
  return <Provider store={store}>
    <Main />
  </Provider>;
}
