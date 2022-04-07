/**
  output: [html]
  params:
    - name: x
      label: data
    - name: color
      label: color
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
    - name: dotsize
      label: Dot Size
      value:
        - control: range
          value: 3
          min: 1
          max: 5
    - name: ticks
      label: Ticks
      value:
        - control: range
          value: 3
          min: 1
          max: 20
    - name: fontsize
      label: Font Size
      value:
        - control: range
          value: 16
          min: 5
          max: 20
    - name: marginleft
      label: Margin Left
      value:
        - control: range
          value: 30
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
**/

// get data
data = await hal9.utils.toRows(data);

if (data.length > 10000) {
  throw (`Up to 10,000 data points are supported for this visualization, but ${data.length} were provided.`);
}

// define axis
const barAxis = 'x';
const valueAxis = 'y';
const barAxisName = barAxis.toUpperCase();
const valueAxisName = valueAxis.toUpperCase();

// get colors and chart data
const chartdata = x
  ? data.map(v => ({ x: hal9.utils.convert(v[x]), color: hal9.utils.convert(v[color]) })) : [];

const colors = [...new Set(chartdata.map(d => d.color))].filter(Boolean).sort((a, b) => a - b);

// create legend
const legend = hal9.utils.createLegend({
  names: colors,
  colors: d3[palette],
});

// create layout for data
const marks = x ? [
  Plot.dot(chartdata, Plot.stackY2({
    x: d => d.x,
    y: 1,
    r: parseInt(dotsize),
    fill: color ? 'color' : d3[palette][0],
  })),
  Plot.ruleY([0]),
] : [];

// create graph
const plot = Plot.plot({
  grid: true,
  marks: [marks],
  [barAxis]: {
    grid: false,
    ticks: parseInt(ticks),
  },
  [valueAxis]: {
    grid: true,
  },
  color: { range: d3[palette] },
  width: html.clientWidth,
  height: html.clientHeight,
  marginTop: 30,
  marginLeft: parseInt(marginleft),
  marginBottom: parseInt(marginbottom),
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
    fontSize: parseInt(fontsize),
  },
});

html.appendChild(legend);
html.appendChild(plot);