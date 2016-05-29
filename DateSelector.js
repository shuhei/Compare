/* @flow */
import React from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';

const WIDTH = 320;

function formatTime(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function times(n: number): Array<number> {
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
}

type ChangeHandler = (date: Date) => void;

function onScroll(onChange: ChangeHandler, candidates: Array<Date>) {
  return event => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / 320);
    // TODO: Call only when the index changes.
    onChange(candidates[index]);
  };
}

type Props = {
  candidates: Array<Date>,
  onChange: ChangeHandler
};

export function DateSelector({ candidates, onChange }: Props) {
  const texts = candidates.map((date, i) => (
    <Text key={i} style={[styles.text]}>{formatTime(date)}</Text>
  ));
  return <View style={[styles.container]}>
    <ScrollView
      // https://github.com/facebook/react-native/issues/2251
      onMomentumScrollEnd={onScroll(onChange, candidates)}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      style={[styles.scroll]}
      scrollEventThrottle={100}
      alwaysBoundHorizontal={false}
    >
      {texts}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  container: {
  },
  text: {
    width: WIDTH,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#889988ff',
    fontSize: 22
  },
  scroll: {
    width: WIDTH
  }
});
