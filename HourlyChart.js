/* @flow */
import React from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';

type Props = {
  yesterday: Array<Object>,
  today: Array<Object>,
  style: Object
};

export function HourlyChart({ yesterday, today, style }: Props) {
  const hours = yesterday.slice(0, 24).map((h, i) => {
    const yh = Math.round((h.temperature - 50) * 4);
    const th = Math.round((today[i].temperature - 50) * 4);
    return <View key={h.time} style={[styles.barBox]}>
      <View style={[styles.bar, styles.barYesterday, { height: yh }]} />
      <View style={[styles.bar, styles.barToday, { height: th }]} />
    </View>;
  });
  const texts = yesterday.slice(0, 12).map((h, i) => (
    <Text key={i} style={[styles.barText]}>{i * 2}</Text>
  ));
  return <View style={style}>
    <View style={styles.chartItems}>{hours}</View>
    <View style={styles.chartItems}>{texts}</View>
  </View>;
}

const styles = StyleSheet.create({
  chartItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  barBox: {
    width: 10,
    marginHorizontal: 1,
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  barText: {
    textAlign: 'center',
    marginTop: 4,
    marginLeft: -5,
    marginRight: 9,
    width: 22,
    fontWeight: 'bold',
    color: '#ff666688'
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  barYesterday: {
    backgroundColor: '#ccddccff'
  },
  barToday: {
    backgroundColor: '#ff666688',
    marginLeft: -10
  }
});
