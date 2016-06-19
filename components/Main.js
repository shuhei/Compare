/* @flow */
import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Image
} from 'react-native';
import startOfDay from 'date-fns/start_of_day';

import type { Forecast, DateChangeHandler } from '../types';
import weatherIcons from '../icons';
import { DateSelector } from './DateSelector';
import { HourlyChart } from './HourlyChart';

type Props = {
  location: string,
  today: Date,
  pastCandidates: Date[],
  pastWeather: Forecast[],
  futureCandidates: Date[],
  futureWeather: Forecast[],
  onFutureChange: DateChangeHandler,
  onPastChange: DateChangeHandler
};

export function Main({
  location,
  today,
  pastWeather,
  futureWeather,
  pastCandidates,
  futureCandidates,
  onPastChange,
  onFutureChange
}: Props) {
  return <View style={styles.container}>
    <View style={styles.header}>
      {location ? <Text style={[styles.location]}>{location}</Text> : null}
    </View>
    <HourlyChart
      past={pastWeather}
      future={futureWeather}
      style={[styles.chart]}
    />
    <View style={styles.footer}>
      <DateSelector
        candidates={futureCandidates}
        onChange={onFutureChange}
        today={today}
        textStyle={{ color: '#ff6666cc' }}
      />
      <Text style={[styles.vs]}>×</Text>
      <DateSelector
        candidates={pastCandidates}
        onChange={onPastChange}
        today={today}
        textStyle={{ color: '#889988dd' }}
      />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  location: {
    color: '#ff6666cc',
    fontSize: 20
  },
  footer: {
    flex: 1.2,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems  : 'center'
  },
  vs: {
    color: '#88998899',
    fontSize: 20
  }
});
