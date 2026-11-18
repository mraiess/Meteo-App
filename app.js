const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const WMO = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
};

const wmo = code => WMO[code] || 'Unknown';

function render(place, data) {
  const text = wmo(data.current.weather_code);

  $('#current').hidden = false;
  $('#current').innerHTML = `
    <h2>${esc(place.name)}${place.country ? ', ' + esc(place.country) : ''}</h2>
    <p class="temp">${Math.round(data.current.temperature_2m)}°</p>
    <p class="details">${esc(text)} · wind ${Math.round(data.current.wind_speed_10m)} km/h</p>`;

  $('#forecast').hidden = false;
  $('#forecast').innerHTML = data.daily.time.map((day, i) => {
    const label = wmo(data.daily.weather_code[i]);
    return `<div class="day">
      <span>${new Date(day + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' })}</span>
      <span class="cond">${esc(label)}</span>
      <span class="temps"><b>${Math.round(data.daily.temperature_2m_max[i])}°</b><i>${Math.round(data.daily.temperature_2m_min[i])}°</i></span>
    </div>`;
  }).join('');
}

async function run(city) {
  const status = $('#status');
  status.hidden = false;
  status.textContent = 'Loading...';

  try {
    const geoRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(city)}&limit=1`);
    if (!geoRes.ok) throw new Error('Location service unavailable');
    const feature = (await geoRes.json()).features?.[0];
    if (!feature) throw new Error(`No city found for "${city}"`);
    const place = {
      name: feature.properties.name,
      country: feature.properties.country,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0]
    };

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      '&current=temperature_2m,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto';
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) throw new Error('Weather service unavailable');
    const data = await weatherRes.json();

    render(place, data);
    status.hidden = true;
    localStorage.setItem('meteo-city', city);
  } catch (err) {
    status.textContent = err.message;
    $('#current').hidden = true;
    $('#forecast').hidden = true;
  }
}

$('#search').onsubmit = e => {
  e.preventDefault();
  const city = $('#city').value.trim();
  if (city) run(city);
};

const saved = localStorage.getItem('meteo-city');
if (saved) {
  $('#city').value = saved;
  run(saved);
}
