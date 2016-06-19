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
    {location ? <Text style={[styles.location]}>{location}</Text> : null}
    <HourlyChart
      past={pastWeather}
      future={futureWeather}
      style={[styles.chart]}
    />
    <View style={styles.selectors}>
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
    alignItems: 'center',
    backgroundColor: '#f5fccc',
  },
  location: {
    color: '#ff6666cc',
    fontSize: 20,
    marginBottom: 67
  },
  chart: {
    marginBottom: 45
  },
  selectors: {
    alignItems  : 'center',
    marginBottom: 55
  },
  vs: {
    color: '#88998899',
    fontSize: 20
  }
});
