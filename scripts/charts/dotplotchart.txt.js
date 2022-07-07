/**
  output: [html]
  description: A simple histogram like distribution which uses dots to show the number of observations in each bin
  params:
    - name: x
      label: data
      description: The column in the dataframe whose values should determine the position of the dots along the x-axis
      single: true
    - name: color
      label: color
      description: The column in the dataframe who's values should determine the color of each dot
      single: true
    - name: palette
      label: D3 Palette
      description: the D3 Palette to determine the color scheme to use
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
      description: the size of each dot
      label: Dot Size
      value:
        - control: range
          value: 3
          min: 1
          max: 5
    - name: ticks
      label: Ticks
      description: The number of ticks on the x-axis
      value:
        - control: range
          value: 3
          min: 1
          max: 20
    - name: fontsize
      description: the size of the font in pixels
      label: Font Size
      value:
        - control: range
          value: 16
          min: 5
          max: 20
    - name: marginleft
      description: the left margin
      label: Margin Left
      value:
        - control: range
          value: 40
          min: 20
          max: 200
    - name: marginbottom
      description: the bottom margin
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