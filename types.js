export type Forecast = {
  time: number,
  temperature: number,
  windBearing: number,
  windSpeed: number,
  summary: ?string,
  icon: ?string
};
