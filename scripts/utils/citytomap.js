/**
  params:
    - name: city
      label: 'City'
    - name: state
      label: 'State Code'
  deps:
    - https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
  cache: true
**/

data = await hal9.utils.toArquero(data);

const csvurl = 'https://raw.githubusercontent.com/kelvins/US-Cities-Database/main/csv/us_cities.csv';

const res = await fetch(csvurl);
latlongcsv = await res.text();

const dsvParser = d3.dsvFormat(',');

var latlong = dsvParser.parse(latlongcsv);

var citymap = {};
latlong.forEach(e => {
  citymap[e.CITY + ',' + e.STATE_CODE] = { lat: e.LATITUDE, long: e.LONGITUDE }
});

data = data.derive({ latitude: aq.escape(e =>
  citymap[e[city] + ',' + e[state]] ? citymap[e[city] + ',' + e[state]].lat : null )
});

data = data.derive({ longitude: aq.escape(e => citymap[e[city] + ',' + e[state]] ? citymap[e[city] + ',' + e[state]].long : null ) });
