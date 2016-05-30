/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';

import { Forecast } from '../../types';

type Props = {
  past: Array<Forecast>,
  future: Array<Forecast>,
  style: StyleSheet
};

type AnimatedForecast = {
  time: number,
  temperature: Animated.Value
};

type AnimatedProps = {
  past: Array<AnimatedForecast>,
  future: Array<AnimatedForecast>,
  style: StyleSheet
};

export class HourlyChart extends Component {
  props: Props;
  state: {
    past: Array<AnimatedForecast>,
    future: Array<AnimatedForecast>
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      past: props.past.map(f => this.animateForecast(f)),
      future: props.future.map(f => this.animateForecast(f))
    };
  }

  componentWillReceiveProps(nextProps: Props) {
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
      style={this.props.style}
    />;
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
      time: forecast.time,
      temperature: new Animated.Value(this.calcHeight(forecast.temperature))
    };
  }

  calcHeight(temperature: number) {
    // TODO: Math.round??
    return (temperature - 50) * 4;
  }
}

function AnimatedHourlyChart({ past, future, style }: AnimatedProps) {
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
  return <View style={[style, styles.container]}>
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
