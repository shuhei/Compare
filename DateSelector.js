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

function formatTime(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function times(n: number): Array<number> {
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
}

function onScroll(onChange) {
  return event => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / 320);
    onChange(index);
  };
}

type Props = {
  timestamp: number,
  onChange: any
};

export function DateSelector({ timestamp, onChange }: Props) {
  const texts = times(3).map(i => (
    <Text key={i} style={[styles.text]}>{formatTime(timestamp)}</Text>
  ));
  return <View style={[styles.container]}>
    <ScrollView
      // https://github.com/facebook/react-native/issues/2251
      onMomentumScrollEnd={onScroll(onChange)}
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
