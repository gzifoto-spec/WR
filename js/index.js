const refreshBtn = document.getElementById('refresh');
const nowEl = document.getElementById('now');
const dataBox = document.getElementById('data');
const iconEl = document.getElementById('icon');
const tempEl = document.getElementById('temp');
const feelsEl = document.getElementById('feels');
const humEl = document.getElementById('hum');
const visEl = document.getElementById('vis');
const rainEl = document.getElementById('rain');

const ENDPOINT = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=43.16&longitude=-8.22' +
    '&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,apparent_temperature,visibility,weather_code,dew_point_2m,rain,is_day' +
    '&timezone=Europe%2FBerlin';

refreshBtn.addEventListener('click', getWeather);
getWeather();   // carga inicial

async function getWeather() {
    nowEl.textContent = 'Cargando…';
    dataBox.hidden = true;
    try {
        const r = await fetch(ENDPOINT);
        const j = await r.json();
        const h = j.hourly;

        // índice de la hora actual (Europe/Berlin)
        const now = new Date();
        const hour = now.getHours();
        const idx = hour;   // coincide con el array

        const temp = h.temperature_2m[idx];
        const feels = h.apparent_temperature[idx];
        const hum = h.relative_humidity_2m[idx];
        const vis = h.visibility[idx];
        const rainProb = h.precipitation_probability[idx];
        const wmo = h.weather_code[idx];
        const isDay = h.is_day[idx];

        // rellenamos DOM
        iconEl.src = iconWMO(wmo, isDay);
        tempEl.textContent = `Temperatura: ${temp} °C`;
        feelsEl.textContent = `Sensación térmica: ${feels} °C`;
        humEl.textContent = `Humedad: ${hum} %`;
        visEl.textContent = `Visibilidad: ${vis / 1000} km`;
        rainEl.textContent = `Prob. lluvia: ${rainProb} %`;
        nowEl.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        dataBox.hidden = false;
    } catch (e) {
        nowEl.textContent = 'Error al obtener datos';
        console.error(e);
    }
}

function iconWMO(code, isDay) {
    const day = isDay === 1;
    const prefix = day ? 'd' : 'n';
    const img = {
        0: '01', 1: '02', 2: '03', 3: '04',
        45: '50', 48: '50', 51: '09', 53: '09', 55: '09',
        61: '10', 63: '10', 65: '10', 71: '13', 73: '13', 75: '13'
    }[Math.floor(code / 10)] || '03';
    return `https://openweathermap.org/img/wn/${img}${prefix}@4x.png`;
}