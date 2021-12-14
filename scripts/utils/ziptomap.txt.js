/**
  params:
    - name: zipcode
      label: 'Zipcode'
  deps:
    - https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
  cache: true
**/

data = await hal9.utils.toArquero(data);

const csvurl = 'https://gist.githubusercontent.com/erichurst/7882666/raw/5bdc46db47d9515269ab12ed6fb2850377fd869e/US%2520Zip%2520Codes%2520from%25202013%2520Government%2520Data';

const res = await fetch(csvurl);
latlongcsv = await res.text();

const dsvParser = d3.dsvFormat(',');

var latlong = dsvParser.parse(latlongcsv);

var latlongmap = {};
latlong.forEach(e => {
  latlongmap[e.ZIP] = { lat: e.LAT, long: e.LNG }
});

data = data.derive({ latitude: aq.escape(e => latlongmap[e[zipcode]] ? latlongmap[e[zipcode]].lat : null ) });
data = data.derive({ longitude: aq.escape(e => latlongmap[e[zipcode]] ? latlongmap[e[zipcode]].long : null ) });
