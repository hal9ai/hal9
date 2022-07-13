/**
  output: [html]
  description: Represent the data as vertices on the map of the world
  params:
    - name: lon
      label: Longitude
      single: true
      description: The column that contains the values that should be interpreted as the Longitude of vertex
    - name: lat
      label: Latitude
      single: true
      description: The column that contains the values that should be interpreted as the Longitude of vertex
    - name: size
      label: Size
      single: true
      description: The column propotional to which the points size should be.
    - name: label
      single: true
      label: Label
      description: The column which contains the labels of each of the verticies.
  deps: [
    'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js',
    'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
  ]
**/
data = await hal9.utils.toRows(data);
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
html.appendChild(link);

const chartdata = lat && lon
 ? data.map(v => ({
     lat: hal9.utils.convert(v[lat]),
     lon: hal9.utils.convert(v[lon]),
     size: hal9.utils.convert(v[size]),
     label: v[label],
   }))
 : [];

let container = html.querySelector('#map');

if (!container) {
  container = document.createElement('div');
  container.id = '#map';
  container.style.width = `${html.clientWidth}px`;
  container.style.height = `${html.clientHeight}px`;
  html.appendChild(container);
}

const bounds = L.latLngBounds(chartdata.map((v) => [v.lat, v.lon]));

if (bounds.isValid()) {
  const map = L.map(container).fitBounds(bounds);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
  ).addTo(map);

  const radiusRange = { min: 5, max: 20 };
  const sizes = chartdata.map(d => d.size);
  const sizeRange = { min: Math.min(...sizes), max: Math.max(...sizes) };

  const getRadius = v => {
    return radiusRange.min + ((v - sizeRange.min) / (sizeRange.max - sizeRange.min)) * (radiusRange.max - radiusRange.min);
  };

  const getTooltip = v =>
    `lon: ${Math.round(v.lon * 100) / 100}<br/>` +
    `lat: ${Math.round(v.lat * 100) / 100}<br/>` +
    (v.size ? `size: ${v.size}<br/>` : '') +
    (v.label ? `label: ${v.label}<br/>` : '');

  chartdata.forEach(v => {
    L.circle([v.lat, v.lon], {
      color: '#3e6597',
      fillColor: '#3e6597',
      fillOpacity: 0.8,
      weight: v.size ? getRadius(v.size) : 10,
    })
    .bindTooltip(getTooltip(v))
    .addTo(map);
  });
}
