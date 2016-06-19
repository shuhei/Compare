/* @flow */
import React, { Component } from 'react';
import {
  AppRegistry,
  LayoutAnimation
} from 'react-native';
import startOfDay from 'date-fns/start_of_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';

import type { Forecast } from './types';
import { Main } from './components/Main';

const LAT = 35.699069;
const LNG = 139.7728588;
const API_KEY = '7e67edfa2365bcdbd128ab5d4865ad95';

function weatherUrl(lat: number, lng: number, date: Date): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng},${timestamp}`;
}

function fetchWeather(date): Promise<{ daily: any, hourly: { data: Forecast[] } }> {
  const url = weatherUrl(LAT, LNG, date);
  return fetch(url)
    .then(res => res.json());
}

function emptyWeather(): Forecast[] {
  const weather = new Array(24);
  for (let i = 0; i < 24; i++) {
    weather[i] = {
      time: i,
      temperature: 0,
      windSpeed: 0,
      windBearing: 0,
      summary: null,
      icon: null
    };
  }
  return weather;
}

class Compare extends Component {
  state: {
    today: Date,
    past: Date,
    pastCandidates: Date[],
    pastWeather: Forecast[],
    future: Date,
    futureCandidates: Date[],
    futureWeather: Forecast[]
  };

  constructor() {
    super();

    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const futureDates = Array(7).fill().map((_, i) => addDays(today, i));

    this.state = {
      today: today,
      past: yesterday,
      pastCandidates: [yesterday, today],
      pastWeather: emptyWeather(),
      future: today,
      futureCandidates: futureDates,
      futureWeather: emptyWeather()
    };
  }

  componentDidMount() {
    this.fetchFuture(this.state.future);
    this.fetchPast(this.state.past);
  }

  onPastChange(date: Date): void {
    if (date.getTime() === this.state.past.getTime()) {
      return;
    }
    this.setState({
      past: date
    });
    this.fetchPast(date);
  }

  onFutureChange(date: Date): void {
    if (date.getTime() === this.state.future.getTime()) {
      return;
    }
    this.setState({
      future: date
    })
    this.fetchFuture(date);
  }

  fetchFuture(date) {
    const promise = fetchWeather(date)
      .then(d => {
        this.animate();
        this.setState({ futureWeather: d.hourly.data });
      });
  }

  fetchPast(date) {
    const promise = fetchWeather(date)
      .then(d => {
        this.animate();
        this.setState({ pastWeather: d.hourly.data });
      });
  }

  animate() {
    LayoutAnimation.spring();
  }

  render() {
    const props = {
      today: this.state.today,
      pastWeather: this.state.pastWeather,
      futureWeather: this.state.futureWeather,
      futureCandidates: this.state.futureCandidates,
      pastCandidates: this.state.pastCandidates,
      onPastChange: this.onPastChange.bind(this),
      onFutureChange: this.onFutureChange.bind(this)
    };
    return <Main {...props} />;
  }
}

AppRegistry.registerComponent('Compare', () => Compare);
