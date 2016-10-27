/* @flow */
import startOfDay from 'date-fns/start_of_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';

import type {
  Forecast,
  Coords,
  Action
} from './types';

type Day = {
  date: Date,
  candidates: Date[],
  weather: Forecast[]
};

type Location = {
  name: ?string,
  coords: ?Coords
};

// TODO: Set from outside.
const today = startOfDay(new Date());
const yesterday = subDays(today, 1);
const futureDates = Array(7).fill().map((_, i) => addDays(today, i));
const pastDates = [yesterday, today];

function initialDay(date: Date, candidates: Date[]): Day {
  return {
    date,
    candidates,
    weather: emptyWeather()
  }
};

const initialLocation = {
  name: null,
  coords: null
};

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

function prefixedDay(prefix: string, initial: Day) {
  return (state: Day = initial, action: Action) => {
    if (action.type.startsWith(prefix)) {
      const newAction = {
        ...action,
        type: action.type.slice(prefix.length)
      };
      return day(state, newAction);
    } else {
      return state;
    }
  };
}

function day(state: Day, action: Action): Day {
  switch (action.type) {
    case 'DATE_CHANGED':
      return { ...state, date: action.payload };
    case 'CANDIDATES_RECEIVED':
      return { ...state, candidates: action.payload };
    case 'WEATHER_RECEIVED':
      return { ...state, weather: action.payload };
    default:
      return state;
  }
}

function location(state: Location = initialLocation, action: Action): Location {
  switch (action.type) {
    case 'LOCATION_COORDS_CHANGED':
      return { ...state, coords: action.payload };
    case 'LOCATION_NAME_CHANGED':
      return { ...state, name: action.payload };
    default:
      return state;
  }
}

function todayFunc(state: Date = today, action: Action): Date {
  return state;
}

export type State = {
  location: Location,
  today: Date,
  future: Day,
  futureDates: [Date],
  past: Day,
  pastDates: [Date],
};

export default {
  location,
  today: todayFunc,
  future: prefixedDay('FUTURE_', initialDay(today, futureDates, emptyWeather())),
  past: prefixedDay('PAST_', initialDay(yesterday, pastDates, emptyWeather()))
};
