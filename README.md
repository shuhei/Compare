# Compare

A super-simple app to compare temperatures of yesterday and today.

[I ported this to Elm!](https://github.com/shuhei/elm-compare)

![Screenshot](/assets/animation.gif)

## Development

Create `secret.json` with an API key of [The Dark Sky Forecast API](https://developer.forecast.io://developer.forecast.io/):

```json
{
  "API_KEY": "Your API key"
}
```

And then:

```js
npm install -g react-native
npm install
react-native run-ios
```

## Thanks

- [React Native](https://facebook.github.io/react-native/)
- [The Dark Sky Forecast API](https://developer.forecast.io/)
- [Climacons](http://adamwhitcroft.com/climacons/)
