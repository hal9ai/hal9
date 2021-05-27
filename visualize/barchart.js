/**
  output: [html]
  params:
    - name: x
      label: x
    - name: y
      label: y
    - name: type
      label: Type
      value:
        - control: select
          value: normal
          values:
            - name: normal
              label: Normal
            - name: stacked
              label: Stacked
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
 
if (y && !Array.isArray(y)) y = [y];
if (!y) y = [];

const chartdata = x && y.length
 ? y.reduce((res, yv, i) => {
     data.forEach(v => {
       res.push({
         x: v[x],
         y: convert(v[yv]),
         z: `y${i}`,
       });
     });
     return res;
   }, [])
 : [];

const distAxis = orientation === "vertical" ? "x" : "y";
const valueAxis = orientation === "vertical" ? "y" : "x";

const distAxisName = distAxis.toUpperCase();
const valueAxisName = valueAxis.toUpperCase();

const group = type === 'stacked'
  ? Plot.groupZ(
      { [valueAxis]: "sum" },
      { [distAxis]: "z", [valueAxis]: "y", fill: "z" }
    )
  : Plot[`group${distAxisName}`](
      { [valueAxis]: "sum" },
      { [distAxis]: "z", [valueAxis]: "y", fill: "z" }
    );

const marks = x && y.length ? [Plot[`bar${valueAxisName}`](chartdata, group)] : [];

html.appendChild(Plot.plot({
  marks,
  [distAxis]: {
    axis: null,
  },
  [valueAxis]: {
    grid: true,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  facet: {
    data: chartdata,
    [distAxis]: "x",
  },
  [`f${distAxis}`]: {
    label: null,
  },
  width: html.clientWidth,
  height: html.clientHeight,
  style: {
    background: hal9.isDark() ? "#222" : '',
    color: hal9.isDark() ? "white" : ''
  },
}));
