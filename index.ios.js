/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Animated,
  Text,
  View,
  Image,
  LayoutAnimation
} from 'react-native';
import startOfDay from 'date-fns/start_of_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';

import { DateSelector } from './ios/components/DateSelector';
import { HourlyChart } from './ios/components/HourlyChart';
import { Forecast } from './types';
import weatherIcons from './icons';

const LAT = 35.699069;
const LNG = 139.7728588;
const API_KEY = '7e67edfa2365bcdbd128ab5d4865ad95';

function weatherUrl(lat: number, lng: number, date: Date): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng},${timestamp}`;
}

function fetchWeather(date): Promise<{ daily: any, hourly: { data: Array<Forecast> } }> {
  const url = weatherUrl(LAT, LNG, date);
  return fetch(url)
    .then(res => res.json());
}

function emptyWeather(): Array<Forecast> {
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
    weather: any,
    pastCandidates: Array<Date>,
    futureCandidates: Array<Date>,
    past: Date,
    future: Date,
    pastWeather: Array<Forecast>,
    futureWeather: Array<Forecast>
  };

  constructor() {
    super();

    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const futureDates = Array(7).fill().map((_, i) => addDays(today, i));

    this.state = {
      weather: null,

      pastCandidates: [yesterday, today],
      futureCandidates: futureDates,

      past: yesterday,
      future: today,

      pastWeather: emptyWeather(),
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
        this.setState({
          weather: d.daily.data[0],
          futureWeather: d.hourly.data
        });
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
    const today = startOfDay(new Date());
    return (
      <View style={styles.container}>
        <HourlyChart
          past={this.state.pastWeather}
          future={this.state.futureWeather}
          style={{ marginBottom: 60 }}
        />
        <View style={styles.selectors}>
          <DateSelector
            candidates={this.state.futureCandidates}
            onChange={this.onFutureChange.bind(this)}
            today={today}
            textStyle={{ color: '#ff6666cc' }}
          />
          <Text style={[styles.vs]}>×</Text>
          <DateSelector
            candidates={this.state.pastCandidates}
            onChange={this.onPastChange.bind(this)}
            today={today}
            textStyle={{ color: '#889988dd' }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5fccc',
  },
  vs: {
    color: '#88998899',
    fontSize: 20
  },
  selectors: {
    alignItems  : 'center'
  }
});

AppRegistry.registerComponent('Compare', () => Compare);
