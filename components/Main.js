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
  today: Date,
  pastCandidates: Date[],
  pastWeather: Forecast[],
  futureCandidates: Date[],
  futureWeather: Forecast[],
  onFutureChange: DateChangeHandler,
  onPastChange: DateChangeHandler
};

export function Main({
  today,
  pastWeather,
  futureWeather,
  pastCandidates,
  futureCandidates,
  onPastChange,
  onFutureChange
}: Props) {
  return <View style={styles.container}>
    <HourlyChart
      past={pastWeather}
      future={futureWeather}
      style={{ marginBottom: 60 }}
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
