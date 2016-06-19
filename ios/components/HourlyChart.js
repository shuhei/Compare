/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View,
  Image,
  ART
} from 'react-native';
import {
  Path,
  Group,
  Shape,
  Surface,
  Transform
} from 'ReactNativeART';

import weatherIcons from '../../icons';
import { Forecast } from '../../types';
import { AnimatedAggregation } from './AnimatedAggregation';
import Dimensions from 'Dimensions';

const CHART_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 250;
const UNIT_SIZE = CHART_WIDTH / 24;
const ICON_SIZE = UNIT_SIZE * 1.6;

const AnimatedGroup = Animated.createAnimatedComponent(Group);
const AnimatedShape = Animated.createAnimatedComponent(Shape);

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
  return (temperature - 50) * 6 - 50;
}

function WeatherIcons({ ranges, style }) {
  const icons = ranges.map((range, i) => {
    const rangeWidth = (range.end - range.start + 1) * UNIT_SIZE;
    const boxStyle = {
      position: 'absolute',
      left: range.start * UNIT_SIZE,
      width: rangeWidth,
      top: 0
    };
    const iconStyle = {
      position: 'absolute',
      width: ICON_SIZE,
      height: ICON_SIZE,
      left: (rangeWidth - ICON_SIZE) / 2,
      top: 0
    };
    return <View key={i} style={[boxStyle]}>
      <Image source={weatherIcons[range.icon]} style={[iconStyle]}/>
    </View>;
  });
  return <View style={[{ height: 50 }, style]}>{icons}</View>;
}

function WeatherBorders({ ranges, style }) {
  const icons = ranges.map((range, i) => {
    const boxStyle = {
      position: 'absolute',
      left: range.start * UNIT_SIZE,
      width: (range.end - range.start + 1) * UNIT_SIZE,
      top: 0,
      borderStyle: 'solid',
      borderLeftColor: '#ff666633',
      borderLeftWidth: i === 0 ? 0 : 1,
      height: CHART_HEIGHT
    };
    return <View key={i} style={[boxStyle]} />;
  });
  return <View style={[{ height: 50 }, style]}>{icons}</View>;
}

function areaChartPath(w: number, h: number, heights: number[]) {
  const points = heights.map((height, i) => ({
    x: (0.5 + i) * UNIT_SIZE,
    y: h - height
  }));
  // http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
  let i = 0;
  let path = Path().moveTo(0, h)
    .lineTo(0, points[i].y)
    .lineTo(points[i].x, points[i].y);
  for (i = 1; i < 24 - 2; i++) {
    const p = points[i];
    const q = points[i + 1];
    const xc = (p.x + q.x) / 2;
    const yc = (p.y + q.y) / 2;
    path = path.curveTo(p.x, p.y, xc, yc);
  }
  path = path
    .curveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
    .lineTo(CHART_WIDTH, points[i + 1].y);
  return path.lineTo(w, h).close();
}

type AnimatedPath = {
  heights: Animated.Value[],
  path: AnimatedAggregation
};

function buildAnimatedPath(): AnimatedPath {
  const animatedHeights = Array.from(Array(24))
    .map(() => new Animated.Value(0));
  const animatedPath = new AnimatedAggregation(animatedHeights, (ts) => {
    const heights = animatedHeights.map(ah => ah.__getValue());
    const p = areaChartPath(CHART_WIDTH, CHART_HEIGHT, heights);
    return p;
  });
  return {
    heights: animatedHeights,
    path: animatedPath
  };
}

function springPath(animatedPath: AnimatedPath, forecasts: Forecast[]): void {
  const heights = forecasts.map(f => calcHeight(f.temperature));
  const anims = animatedPath.heights.map((ah, i) => {
    return Animated.spring(ah, {
      toValue: heights[i],
      friction: 3,
      tension: 50
    });
  });
  Animated.parallel(anims).start();
}

export class HourlyChart extends Component {
  state: {
    future: AnimatedPath,
    past: AnimatedPath
  };

  constructor(props: Props) {
    super();
    this.state = {
      future: buildAnimatedPath(),
      past: buildAnimatedPath()
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.future !== nextProps.future) {
      springPath(this.state.future, nextProps.future);
    }
    if (this.props.past !== nextProps.past) {
      springPath(this.state.past, nextProps.past);
    }
  }

  render() {
    const { past, future, style } = this.props;

    const labels = past.slice(0, 12).map((h, i) => (
      <Text key={i} style={[styles.hourLabel]}>{i * 2}</Text>
    ));

    const bars = past.slice(0, 24).map((p, i) => {
      const f = future[i];
      return <View key={i} style={[styles.barBox]}>
        <View style={[styles.bar, styles.barPast, { height: calcHeight(p.temperature) }]} />
        <View style={[styles.bar, styles.barFuture, { height: calcHeight(f.temperature) }]} />
      </View>;
    });
    const barChart = <View style={styles.chartItems}>{bars}</View>;

    const heights = future.map(f => calcHeight(f.temperature));
    const chartPath = areaChartPath(CHART_WIDTH, CHART_HEIGHT, heights);
    const areaChart = <View style={[{ width: CHART_WIDTH, height: CHART_HEIGHT, position: 'absolute', top: 0 }]}>
      <Surface width={CHART_WIDTH} height={CHART_HEIGHT} style={[{ backgroundColor: '#00000000' }]}>
        <AnimatedShape fill="#99999944" d={this.state.past.path} />
        <AnimatedShape fill="#ff666666" d={this.state.future.path} />
      </Surface>
    </View>;

    const chart = areaChart;
    // const chart = barChart;

    const ranges = makeRanges(future);

    return <View style={[style, styles.container]}>
      <WeatherBorders ranges={ranges} style={{ position: 'absolute', top: 0}} />
      {chart}
      <WeatherIcons ranges={ranges} style={{ position: 'absolute', top: 0 }} />
      <View style={styles.chartItems}>{labels}</View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT + 25,
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
  hourLabel: {
    textAlign: 'center',
    marginTop: 4,
    marginRight: 9,
    width: UNIT_SIZE * 2 - 9,
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
