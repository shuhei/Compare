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

import { DateSelector } from './DateSelector';
import { HourlyChart } from './HourlyChart';
import sample from './sample.json';
import sampleToday from './sample-today.json';
import sampleYesterday from './sample-yesterday.json';

const API_KEY = '7e67edfa2365bcdbd128ab5d4865ad95';

function currentUrl(lat: number, lng: number): string {
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng}`;
}

type State = {
  ratio: any,
  today: Array<Object>,
  yesterday: Array<Object>
};

class Compare extends Component<void, {}, State> {
  constructor() {
    super();
    this.state = {
      ratio: new Animated.Value(100),
      today: [],
      yesterday: []
    };
  }

  componentDidMount() {
    const lat = 35.699069;
    const lng = 139.7728588;
    const url = currentUrl(lat, lng);
    // https://api.forecast.io/forecast/7e67edfa2365bcdbd128ab5d4865ad95/35.699069,139.7728588
    // https://api.forecast.io/forecast/7e67edfa2365bcdbd128ab5d4865ad95/35.699069,139.7728588,1464102000
    // fetch(url).then(d => console.log(d));
    this.setState({
      today: sample.hourly.data,
      yesterday: sampleYesterday.hourly.data
    });
  }

  onYesterdayChange(index: number): void {
    console.log('yeserday change', index);
  }

  onTodayChange(index: number): void {
    console.log('today change', index);
  }

  render() {
    return (
      <View style={styles.container}>
        <HourlyChart yesterday={this.state.yesterday} today={this.state.today} style={[{ marginBottom: 20 }]}/>
        <DateSelector timestamp={1466895600} onChange={this.onYesterdayChange.bind(this)} />
        <DateSelector timestamp={1466895600} onChange={this.onTodayChange.bind(this)} />
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
