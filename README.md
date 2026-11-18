# Meteo

Minimal weather app: search a city and see current conditions plus a 7-day forecast.

## Run

Open `index.html` in any modern browser. An internet connection is required for the weather data.

## Usage

- Enter a city name and press **Search**.
- Shows current temperature, condition, and wind speed, followed by 7 daily min/max forecasts.
- The last searched city is remembered in `localStorage` (key: `meteo-city`) and loaded on the next visit.
- If the request fails, an error message is shown and previous results are hidden.

## APIs

Both are free and need no API key:

- [Photon](https://photon.komoot.io/) — turns the city name into coordinates
- [Open-Meteo](https://open-meteo.com/) — current weather and daily forecast

## Files

- `index.html` — page structure
- `style.css` — layout and styling
- `app.js` — city lookup, forecast request, rendering, error handling
