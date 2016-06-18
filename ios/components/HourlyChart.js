/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View,
  Image
} from 'react-native';

import weatherIcons from '../../icons';
import { Forecast } from '../../types';

const UNIT_SIZE = 14;

type Props = {
  past: Forecast[],
  future: Forecast[],
  style: StyleSheet
};

type WeatherRange = {
  icon: string,
  start: number,
  end: number
};

function makeRanges(forecasts: Forecast[]): WeatherRange[] {
  const ranges = forecasts.reduce((acc, item, i) => {
    if (i === 0) {
      acc.push({ icon: item.icon, start: i, end: i });
    } else {
      const last = acc[acc.length - 1];
      if (i % 2 === 1 || last.icon === item.icon) {
        last.end = i;
      } else {
        acc.push({ icon: item.icon, start: i, end: i });
      }
    }
    return acc;
  }, []);
  return ranges;
}

function calcHeight(temperature: number): number {
  // TODO: Math.round??
  return (temperature - 50) * 4;
}

export function HourlyChart({ past, future, style }: Props) {
  const bars = past.slice(0, 24).map((p, i) => {
    const f = future[i];
    return <View key={i} style={[styles.barBox]}>
      <Animated.View style={[styles.bar, styles.barPast, { height: calcHeight(p.temperature) }]} />
      <Animated.View style={[styles.bar, styles.barFuture, { height: calcHeight(f.temperature) }]} />
    </View>;
  });

  const barTexts = past.slice(0, 12).map((h, i) => (
    <Text key={i} style={[styles.barText]}>{i * 2}</Text>
  ));

  const borderWidth = 2;
  const ranges = makeRanges(future);
  const icons = ranges.map((range, i) => {
    const boxStyle = {
      position: 'absolute',
      left: range.start * UNIT_SIZE,
      width: (range.end - range.start + 1) * UNIT_SIZE
    };
    const borderStyle = {
      borderStyle: 'solid',
      borderLeftColor: '#ff666622',
      borderLeftWidth: 2,
      borderRightColor: '#ff666622',
      borderRightWidth: i === ranges.length - 1 ? 2 : 0,
      height: 100
    };
    const iconStyle = {
      position: 'absolute',
      width: UNIT_SIZE * 2,
      height: UNIT_SIZE * 2,
      left: (range.end - range.start + 1 - 2) * UNIT_SIZE / 2,
      top: 0
    };
    return <View key={i} style={[boxStyle]}>
      <View style={[borderStyle]} />
      <Image source={weatherIcons[range.icon]} style={[iconStyle]}/>
    </View>;
  });

  return <View style={[style, styles.container]}>
    <View style={[{ height: 50 }]}>{icons}</View>
    <View style={styles.chartItems}>{bars}</View>
    <View style={styles.chartItems}>{barTexts}</View>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    justifyContent: 'flex-end'
  },
  chartItems: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  barBox: {
    width: 10,
    marginHorizontal: 2,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  barText: {
    textAlign: 'center',
    marginTop: 4,
    marginLeft: -5,
    marginRight: 9,
    width: 24,
    fontWeight: 'bold',
    color: '#99999988',
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barPast: {
    backgroundColor: '#bbccbbff',
  },
  barFuture: {
    backgroundColor: '#ff666688',
    marginLeft: -10,
  }
});
