/**
  output: [html]
  params: [x, y, color, size]
  deps: [
    'chart-utils.js',
    'https://cdn.jsdelivr.net/npm/d3@6',
    'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1',
  ]
**/

const chartdata = x && y
 ? data.map(v => ({
     x: convert(v[x]),
     y: convert(v[y]),
     color: convert(v[color]),
     size: convert(v[size]),
   }))
 : [];

const chart = Plot.dot(
  chartdata, {
    x: x ? "x" : [],
    y: y ? "y" : [],
    r: size ? "size" : 5,
    fill: color ? "color" : d3.schemeTableau10[0],
  }
);

html.appendChild(Plot.plot({
  marks: [chart],
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
  style: {
    background: hal9.isDark() ? "#222" : '',
    color: hal9.isDark() ? "white" : ''
  },
}));
