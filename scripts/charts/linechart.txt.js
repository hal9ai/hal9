/**
  output: [html]
  params:
    - x
    - y
    - name: palette
      label: D3 Palette
      value:
        - control: paletteSelect
          value: schemeTableau10
          values:
            - schemeTableau10
            - schemeAccent
            - schemeDark2
            - schemePaired
            - schemeSet1
            - schemeSet2
            - schemeSet3
  deps: [
    'chart-utils.js',
    'https://cdn.jsdelivr.net/npm/d3@6',
    'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1',
  ]
**/

if (y && !Array.isArray(y)) y = [y];
if (!y) y = [];

const chartdata = x && y.length
 ? data.map(v => {
     const value = { x: convert(v[x]) };
     y.map((yv, i) => {
       value[`y${i}`] = convert(v[yv]);
     });
     return value;
   })
 : [];

const legend = createLegend({ names: y, colors: d3[palette] });
const plot = Plot.plot({
  marks: [y.map((_, i) =>
    Plot.line(chartdata, {
      x: x ? 'x' : [],
      y: `y${i}`,
      stroke: d3[palette][i],
    })
  )],
  x: {
    grid: true,
    inset: 10,
  },
  y: {
    grid: true,
    inset: 10,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  width: html.clientWidth,
  height: html.clientHeight,
  marginTop: 30,
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
  },
});

legend.style.color = hal9.isDark() ? 'white' : '';

html.appendChild(legend);
html.appendChild(plot);
