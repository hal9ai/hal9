/**
  output: [html]
  params:
    - name: x
      label: x
    - name: color
      label: color
    - name: thresholds
      label: Thresholds
      value:
        - control: range
          value: 20
          min: 0
          max: 100
    - name: orientation
      label: Orientation
      value:
        - control: select
          value: vertical
          values:
            - name: vertical
              label: Vertical
            - name: horizontal
              label: Horizontal
  deps: [
    'chart-utils.js',
    'https://cdn.jsdelivr.net/npm/d3@6',
    'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1',
  ]
**/

const chartdata = x
  ? data.map(v => ({ x: convert(v[x]), color: convert(v[color]) }))
  : [];

const barAxis = orientation === "vertical" ? "x" : "y";
const valueAxis = orientation === "vertical" ? "y" : "x";

const barAxisName = barAxis.toUpperCase();
const valueAxisName = valueAxis.toUpperCase();

const marks = x ? [
  Plot[`rect${valueAxisName}`](chartdata, Plot[`bin${barAxisName}`](
    { [valueAxis]: "count" },
    { [barAxis]: "x", thresholds: parseInt(thresholds), fill: color ? "color" : d3.schemeTableau10[0]}
  )),
  Plot[`rule${valueAxisName}`]([0])
] : [];

html.appendChild(Plot.plot({
  marks,
  [valueAxis]: {
    grid: true,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  width: html.clientWidth,
  height: html.clientHeight,
  style: {
    background: hal9.isDark() ? "#222" : '',
    color: hal9.isDark() ? "white" : ''
  },
}));

