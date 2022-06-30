/**
  output: [html]
  params:
    - name: x
    - name: 'y'
    - name: fontsize
      label: Font Size
      value:
        - control: range
          value: 10
          min: 5
          max: 20
    - name: marginleft
      label: Margin left
      value:
        - control: range
          value: 40
          min: 20
          max: 200
    - name: marginbottom
      label: Margin Bottom
      value:
        - control: range
          value: 30
          min: 20
          max: 200
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
    - https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1
  credit:
    - name: analyzer2004
    - url: https://twitter.com/analyzer2004
**/

data = await hal9.utils.toRows(data);

if (data.length > 10000) {
  throw(`Up to 10,000 data points are supported for this visualization, but ${data.length} were provided.`);
}

if (y && !Array.isArray(y)) y = [y];
if (!y) y = [];

const chartdata = x && y.length
 ? y.reduce((res, yv, i) => {
     data.forEach(v => {
       res.push({
         x: v.x,
         y: hal9.utils.convert(v[yv]),
         z: `y${i}`,
       });
     });
     return res;
   }, [])
 : [];

const length = data.length - 1;

let last = 0;
let accu = 0;

const waterfall = data.map((d, i) => {
  last = accu;
  accu += d[y];

  return {
    x: d[x],
    nextX: i < length ? data[i + 1][x] : 'Total',
    prior: last,
    accu: accu,
    delta: d[y],
  };
});

const totalLabel = 'Total';

waterfall.push({
  x: totalLabel,
  nextX: null,
  prior: 0,
  accu: accu,
  delta: 0
});

const colors = {
  Increase: '#649334',
  Decrease: '#cc392b',
  Total: '#1f77b4',
};

const plotLabel = (data, dy) =>
  Plot.text(data, {
    x: 'x',
    y: 'accu',
    dy: dy,
    fontFamily: '',
    fontWeight: 400,
    text: d => d3.format('.1s')(d.accu),
  });

const marks = x && y.length ? [
  Plot.barY(waterfall, {
    x: 'x',
    y1: 'prior',
    y2: 'accu',
    fill: d => (d.x === totalLabel
      ? totalLabel
      : (d.delta >= 0 ? 'Increase' : 'Decrease')
    ),
  }),
  Plot.ruleY(waterfall, {
    x1: 'x',
    x2: 'nextX',
    y: 'accu',
    stroke: '#333',
    strokeDasharray: '1.5'
  }),
  plotLabel(waterfall.filter(d => d.delta >= 0), '-0.5em'),
  plotLabel(waterfall.filter(d => d.delta < 0), '1.5em')
] : [];

const plot = Plot.plot({
  width: html.clientWidth,
  height: html.clientHeight,
  x: {
    align: 0,
    grid: false,
    round: false,
    label: '',
    domain: waterfall.map(d => d.x),
    paddingInner: 0.1,
  },
  y: {
    grid: true,
    nice: true,
    label: '',
    tickFormat: d3.format('.2s'),
  },
  color: {
    domain: Object.keys(colors),
    range: Object.values(colors),
  },
  marks,
  style: {
    background: hal9.isDark() ? '#222' : '#fff',
    color: hal9.isDark() ? '#aaa' : '#333',
    fontSize: parseInt(fontsize),
  },
  caption: null,
  marginRight: 20,
  marginTop: 20,
  marginLeft: parseInt(marginleft),
  marginBottom: parseInt(marginbottom),
});

html.appendChild(plot);
