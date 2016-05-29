/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Animated,
  Text,
  View
} from 'react-native';
import startOfDay from 'date-fns/start_of_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';

import { DateSelector } from './DateSelector';
import { HourlyChart } from './HourlyChart';

import sample from './sample.json';
import sampleToday from './sample-today.json';
import sampleYesterday from './sample-yesterday.json';

const LAT = 35.699069;
const LNG = 139.7728588;
const API_KEY = '7e67edfa2365bcdbd128ab5d4865ad95';

function weatherUrl(lat: number, lng: number, date: Date): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng},${timestamp}`;
}

function fetchWeather(date): Promise<Array<Object>> {
  const url = weatherUrl(LAT, LNG, date);
  return fetch(url)
    .then(res => res.json())
    .then(d => d.hourly.data);
}

function emptyWeather() {
  const weather = new Array(24);
  for (let i = 0; i < 24; i++) {
    weather[i] = {
      time: i,
      temperature: 0
    };
  }
  return weather;
}

class Compare extends Component<void, {}, any> {
  constructor() {
    super();
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    this.state = {
      ratio: new Animated.Value(100),

      pastCandidates: [yesterday],
      futureCandiates: [today, addDays(today, 1), addDays(today, 2), addDays(today, 3)],

      past: yesterday,
      future: today,

      pastWeather: emptyWeather(),
      futureWeather: emptyWeather(),
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
    console.log('fetching future', date);
    fetchWeather(date)
      .then(d => {
        console.log('fetched future', date, d)
        this.setState({ futureWeather: d });
      });
  }

  fetchPast(date) {
    fetchWeather(date)
      .then(d => this.setState({ pastWeather: d }));
  }

  render() {
    return (
      <View style={styles.container}>
        <HourlyChart
          past={this.state.pastWeather}
          future={this.state.futureWeather}
          style={[{ marginBottom: 20 }]}
        />
        <DateSelector
          candidates={this.state.pastCandidates}
          onChange={this.onPastChange.bind(this)}
        />
        <DateSelector
          candidates={this.state.futureCandiates}
          onChange={this.onFutureChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCCC',
  }
});

AppRegistry.registerComponent('Compare', () => Compare);
