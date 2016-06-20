/* @flow */
import React, { Component } from 'react';
import {
  LayoutAnimation
} from 'react-native';
import startOfDay from 'date-fns/start_of_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import Geocoder from 'react-native-geocoder';

import type { Forecast } from '../types';
import { Main } from '../components/Main';
import { API_KEY } from '../../secret.json';

const LAT = 35.699069;
const LNG = 139.7728588;

type WeatherResponse = {
  hourly: {
    data: Forecast[]
  }
};

function weatherUrl(date: Date, lat: number, lng: number): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng},${timestamp}`;
}

function fetchWeather(date: Date, lat: number, lng: number): Promise<WeatherResponse> {
  const url = weatherUrl(date, lat, lng);
  return fetch(url)
    .then(res => res.json());
}

function emptyWeather(): Forecast[] {
  const weather = new Array(24);
  for (let i = 0; i < 24; i++) {
    weather[i] = {
      time: i,
      temperature: 0,
      windSpeed: 0,
      windBearing: 0,
      summary: null,
      icon: null
    };
  }
  return weather;
}

export class Compare extends Component {
  state: {
    location: string,
    lat: ?number,
    lng: ?number,
    today: Date,
    past: Date,
    pastCandidates: Date[],
    pastWeather: Forecast[],
    future: Date,
    futureCandidates: Date[],
    futureWeather: Forecast[]
  };

  constructor() {
    super();

    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const futureDates = Array(7).fill().map((_, i) => addDays(today, i));

    this.state = {
      location: 'Getting location...',
      lat: null,
      lng: null,
      today: today,
      past: yesterday,
      pastCandidates: [yesterday, today],
      pastWeather: emptyWeather(),
      future: today,
      futureCandidates: futureDates,
      futureWeather: emptyWeather()
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setPosition(position.coords.latitude, position.coords.longitude);
    }, error => {
      // TODO: Fix error on iOS simulator.
      this.setPosition(LAT, LNG);
    });
  }

  setPosition(lat: number, lng: number) {
    const pos = { lat, lng };
    this.setState(pos);
    this.fetchFuture(this.state.future);
    this.fetchPast(this.state.past);

    Geocoder.geocodePosition(pos)
      .then(res => {
        console.log(res);
        const geocode = res[0];
        const location = `${geocode.locality}, ${geocode.adminArea}`;
        this.setState({ location: location });
      })
      .catch(e => {
        console.log(e);
        this.setState({ location: 'Failed to geocode' });
      });
  }

  onPastChange(date: Date): void {
    if (date.getTime() === this.state.past.getTime()) {
      return;
    }
    this.setState({
      past: date
    });
    this.fetchPast(date);
  }

  onFutureChange(date: Date): void {
    if (date.getTime() === this.state.future.getTime()) {
      return;
    }
    this.setState({
      future: date
    })
    this.fetchFuture(date);
  }

  fetchFuture(date: Date) {
    if (this.state.lat == null || this.state.lng == null) {
      return;
    }
    const promise = fetchWeather(date, this.state.lat, this.state.lng)
      .then(d => {
        this.animate();
        this.setState({ futureWeather: d.hourly.data });
      });
  }

  fetchPast(date: Date) {
    if (this.state.lat == null || this.state.lng == null) {
      return;
    }
    const promise = fetchWeather(date, this.state.lat, this.state.lng)
      .then(d => {
        this.animate();
        this.setState({ pastWeather: d.hourly.data });
      });
  }

  animate() {
    LayoutAnimation.spring();
  }

  render() {
    const props = {
      location: this.state.location,
      today: this.state.today,
      pastWeather: this.state.pastWeather,
      futureWeather: this.state.futureWeather,
      futureCandidates: this.state.futureCandidates,
      pastCandidates: this.state.pastCandidates,
      onPastChange: this.onPastChange.bind(this),
      onFutureChange: this.onFutureChange.bind(this)
    };
    return <Main {...props} />;
  }
}
