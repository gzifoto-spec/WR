<table>
<tr>
<th align="left" width="80%">
<p> 
<h1>WR</h1><br><br>   
<h3>🌦️ Culleredo Weather Report – Mobile Web App</h3><br><br>  
A minimal PWA that shows live weather for Culleredo (Galicia, Spain) using the free Open-Meteo API.<b>
Built with vanilla HTML · CSS · JS – no frameworks, no keys, no backend.
</p>
</th>
<th align="right" width="20%">
<p> 
<img width="200" alt="Screenshot From site" src="https://github.com/user-attachments/assets/60e49755-98c8-4f8c-98c2-13f53a1c265d" />
</p>
</th>
</tr>
</table>

⚡️ Quick start

    Clone / download this repo
    Open index.html in any browser (mobile first)
    Enjoy the hard-coded Culleredo forecast

📱 What you get

    Current temperature, “feels-like”, humidity, visibility, rain probability
    Dynamic weather icon (day / night)
    One-tap refresh button
    Responsive card UI (≈ 360 px wide)

## Directory Tree
    ┬WR
    |
    ├─┬libs
    | |
    | └─bootstrap
    |
    ├─┬js
    | |
    | ├─index.js
    | |
    | ├─header.js
    | |
    | ├─footer.js
    |
    ├─┬css
    | |
    | └─index.css
    |
    ├─┬assets
    | |
    | └─img
    |
    ├─┬data
    | |
    | └ // app info (.json files)
    |
    └index.html

## How it works?  

The heart of the project is the JavaScript file that dynamically fetches API data and displays it on the card.
The first few lines save references to every DOM element will be needed, storing them in constants obtained by ID:  

        const refreshBtn = document.getElementById('refresh');
        const nowEl      = document.getElementById('now');
        const dataBox    = document.getElementById('data');
        const iconEl     = document.getElementById('icon');
        const tempEl     = document.getElementById('temp');
        const feelsEl    = document.getElementById('feels');
        const humEl      = document.getElementById('hum');
        const visEl      = document.getElementById('vis');
        const rainEl     = document.getElementById('rain');

Next the endpoint URL chain is built

       const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'+
      '?latitude=43.16&longitude=-8.22'+
      '&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,apparent_temperature,visibility,weather_code,dew_point_2m,rain,is_day'+
      '&timezone=Europe%2FBerlin';    

First load: attaches a click listener and the main function is immediately invoked.

    refreshBtn.addEventListener('click', getWeather);
    getWeather();

getWeather() – the core of the program

    async function getWeather(){
      nowEl.textContent='Cargando…';
      dataBox.hidden=true;

the try catch inside the function: fetch() returns a Promise, await pauses execution until the server responds, without blocking the browser, r.json() converts the HTTP response into a plain JavaScript object.

      try{
    const r = await fetch(ENDPOINT);
    const j = await r.json();
    const h = j.hourly;

Open-Meteo returns 24 hourly steps (0-23). Because we sent timezone=Europe%2FBerlin, simply using getHours() obtains the local hour and use it as the array index.

    const now = new Date();
    const hour = now.getHours();
    const idx  = hour;

Extracting data to array, where idx is the index inside the array

    const temp     = h.temperature_2m[idx];
    const feels    = h.apparent_temperature[idx];
    const hum      = h.relative_humidity_2m[idx];
    const vis      = h.visibility[idx];
    const rainProb = h.precipitation_probability[idx];
    const wmo      = h.weather_code[idx];
    const isDay    = h.is_day[idx];

Rendering the screen:
Template literals interpolate variables cleanly. toLocaleTimeString() formats the time in the user’s language. Setting hidden = false reveals the results block.

    iconEl.src = iconWMO(wmo, isDay);
    tempEl.textContent   = `Temperatura: ${temp} °C`;
    feelsEl.textContent  = `Sensación térmica: ${feels} °C`;
    humEl.textContent    = `Humedad: ${hum} %`;
    visEl.textContent    = `Visibilidad: ${vis / 1000} km`;
    rainEl.textContent   = `Prob. lluvia: ${rainProb} %`;
    nowEl.textContent    = now.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
    dataBox.hidden=false;

Try-catch closes once 'catch' fetches any network or JSON error and console.error prints the details into the debbuging console.

      }catch(e){
        nowEl.textContent='Error al obtener datos';
        console.error(e);
      }

Function iconWMO() translates weather code into an image. Math.floor(code/10) groups codes (0,1,2,3…) into ranges. We get free icons available at OpenWeatherMap. || '03' otherwise shows this default icon in case no one is found

    function iconWMO(code, isDay){
      const day = isDay === 1;
      const prefix = day ? 'd' : 'n';
      const img = {
        0:'01', 1:'02', 2:'03', 3:'04',
        45:'50', 48:'50', 51:'09', 53:'09', 55:'09',
        61:'10', 63:'10', 65:'10', 71:'13', 73:'13', 75:'13'
      }[Math.floor(code/10)] || '03';
      return `https://openweathermap.org/img/wn/${img}${prefix}@4x.png`;
    }
