export type Forecast = {
  time: number,
  temperature: number,
  windBearing: number,
  windSpeed: number,
  summary: ?string,
  icon: ?string
};

export type Coords = {
  lat: number,
  lng: number
};

export type Action = {
  type: string,
  payload: any
};

export type ChangeHandler = (date: Date) => void;
