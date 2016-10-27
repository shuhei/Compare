/* @flow */
import { LayoutAnimation } from 'react-native';
import Geocoder from 'react-native-geocoder';
import type { MiddlewareAPI } from 'redux';
import { ActionsObservable } from 'redux-observable';
// FIXME: Importing from 'rxjs' to make flow check types. This bundles everything from rxjs.
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/observable/merge';
// import 'rxjs/add/observable/combineLatest';
// import 'rxjs/add/observable/empty';

import { API_KEY } from '../secret.json';
import type {
  Action,
  Forecast,
  Coords
} from './types';
import type { State } from './reducers';

type WeatherResponse = {
  hourly: {
    data: Forecast[]
  }
};

export default function (action$: ActionsObservable<Action>, store: MiddlewareAPI<State, Action>): Observable<Action> {
  const locationCoords$ = action$.ofType('APP_INIT')
    .mergeMap(() => Observable.fromPromise(getLocation()))
    .map(coords => ({ type: 'LOCATION_COORDS_CHANGED', payload: coords }));

  const locationName$ = locationCoords$
    .mergeMap(({ payload }) => Observable.fromPromise(geocodePosition(payload)))
    .map(name => ({ type: 'LOCATION_NAME_CHANGED', payload: name }));

  const pastWeather$ = createWeatherStream('PAST_', 'past', action$, store);
  const futureWeather$ = createWeatherStream('FUTURE_', 'future', action$, store);

  return Observable.merge(
    locationCoords$,
    locationName$,
    pastWeather$,
    futureWeather$
  ).do(() => LayoutAnimation.spring());
}

function createWeatherStream(prefix: string, dayKey: string, action$, store): Observable<Action> {
  return Observable.merge(
    action$.ofType('LOCATION_COORDS_CHANGED'),
    action$.ofType(`${prefix}DATE_CHANGED`)
  )
    .mergeMap(() => {
      const state = store.getState();
      const date = state[dayKey].date;
      const { coords } = state.location;
      if (coords) {
        return getWeather(date, coords);
      } else {
        return Observable.empty();
      }
    })
    .map(weather => ({ type: `${prefix}WEATHER_RECEIVED`, payload: weather.hourly.data }));
}

function getJson(url: string): Observable<any> {
  const promise = fetch(url).then(res => res.json());
  return Observable.fromPromise(promise);
}

function weatherUrl(date: Date, { lat, lng }: Coords): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng},${timestamp}`;
}

function getWeather(date: Date, coords: Coords): Observable<WeatherResponse> {
  const url = weatherUrl(date, coords);
  return getJson(url);
}

function getLocation(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, error => {
      // Akihabara for dummy location.
      resolve({
        lat: 35.699069,
        lng: 139.7728588
      });
    });
  });
}

function geocodePosition(coords: Coords): Promise<string> {
  return Geocoder.geocodePosition(coords)
    .then(res => {
      const geocode = res[0];
      return `${geocode.locality}, ${geocode.adminArea}`;
    })
    .catch(e => {
      console.log('error geocoding', e);
      return 'Failed to geocode';
    });
}
