/* @flow */
import React from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';
import Dimensions from 'Dimensions';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/difference_in_days';

import type { DateChangeHandler } from '../types';

const WIDTH = Dimensions.get('window').width;

type Props = {
  candidates: Date[],
  onChange: DateChangeHandler,
  today: Date,
  textStyle: Object
};

export function DateSelector({ candidates, onChange, today, textStyle }: Props) {
  const items = candidates.map((date, i) => (
    <View key={i} style={[styles.item]}>
      <Text style={[styles.text, textStyle]}>{formatDate(date, today)}</Text>
    </View>
  ));
  return <View style={[styles.container]}>
    <ScrollView
      // https://github.com/facebook/react-native/issues/2251
      onMomentumScrollEnd={onScroll(onChange, candidates)}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={100}
      alwaysBoundHorizontal={false}
    >
      {items}
    </ScrollView>
  </View>;
}

function formatDate(date: Date, today: Date): string {
  switch (differenceInDays(date, today)) {
    case 0:
      return 'Today';
    case 1:
      return 'Tomorrow';
    case -1:
      return 'Yesterday';
    default:
      return format(date, 'ddd, MMM D, YYYY');
  }
}

function onScroll(onChange: DateChangeHandler, candidates: Array<Date>) {
  return event => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / WIDTH);
    // TODO: Call only when the index changes.
    onChange(candidates[index]);
  };
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH
  },
  text: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 22
  }
});
