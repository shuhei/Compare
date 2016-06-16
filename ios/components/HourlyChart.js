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
  past: Array<Forecast>,
  future: Array<Forecast>,
  style: StyleSheet
};

type AnimatedForecast = {
  time: number,
  temperature: Animated.Value,
  summary: ?string,
  icon: ?string,
  windSpeed: number,
  windBearing: number
};

type AnimatedProps = {
  past: Array<AnimatedForecast>,
  future: Array<AnimatedForecast>,
  ranges: Array<Object>,
  style: StyleSheet
};

export class HourlyChart extends Component {
  props: Props;
  state: {
    past: Array<AnimatedForecast>,
    future: Array<AnimatedForecast>,
    ranges: Array<Object>
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      past: props.past.map(f => this.animateForecast(f)),
      future: props.future.map(f => this.animateForecast(f)),
      ranges: []
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ranges: this.makeRanges(nextProps)
    });

    if (this.props.past !== nextProps.past) {
      this.springForecasts(this.state.past, nextProps.past).start();
    }
    if (this.props.future !== nextProps.future) {
      this.springForecasts(this.state.future, nextProps.future).start();
    }
  }

  render() {
    return <AnimatedHourlyChart
      past={this.state.past}
      future={this.state.future}
      ranges={this.state.ranges}
      style={this.props.style}
    />;
  }

  makeRanges(nextProps: Props) {
    const future = nextProps.future;
    const ranges = future.reduce((acc, item, i) => {
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

  springForecasts(from: Array<AnimatedForecast>, to: Array<Forecast>) {
    const springs = from.map((forecast, i) => Animated.spring(forecast.temperature, {
      toValue: this.calcHeight(to[i].temperature),
      friction: 3,
      tension: 20
    }));
    return Animated.parallel(springs);
  }

  animateForecast(forecast: Forecast): AnimatedForecast {
    return {
      ...forecast,
      temperature: new Animated.Value(this.calcHeight(forecast.temperature))
    };
  }

  calcHeight(temperature: number) {
    // TODO: Math.round??
    return (temperature - 50) * 4;
  }
}

function AnimatedHourlyChart({ past, future, ranges, style }: AnimatedProps) {
  console.log(ranges);
  const hours = past.slice(0, 24).map((p, i) => {
    const f = future[i];
    return <View key={i} style={[styles.barBox]}>
      <Animated.View style={[styles.bar, styles.barPast, { height: p.temperature }]} />
      <Animated.View style={[styles.bar, styles.barFuture, { height: f.temperature }]} />
    </View>;
  });
  const texts = past.slice(0, 12).map((h, i) => (
    <Text key={i} style={[styles.barText]}>{i * 2}</Text>
  ));
  const borderWidth = 2;
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
    <View style={styles.chartItems}>{hours}</View>
    <View style={styles.chartItems}>{texts}</View>
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
