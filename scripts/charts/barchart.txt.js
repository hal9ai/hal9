/**
  output: [html]
  description: Create a chart that shows point estimates as the height of a rectangular bar
  params:
    - name: x
      label: x
      description: The variable that horizontal axis
    - name: y
      label: y
      description: The variable that should be on the vertical axis.
    - name: type
      label: Type
      description: One of 'grouped' or 'stacked'. In grouped mode, bars are placed next to each other, in stacked mode bars are placed above each other.
      value:
        - control: select
          value: grouped
          values:
            - name: grouped
              label: Grouped
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
    - name: palette
      label: D3 Palette
      description: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
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
    - name: fontsize
      label: Font Size
      description: Size of the font to be used in the x and y axes.
      value:
        - control: range
          value: 16
          min: 5
          max: 20
    - name: tickrotation
      label: Tick Rotation
      description: The angle at which to place the x-axis labels
      value:
        - control: range
          value: 0
          min: 0
          max: 90
    - name: marginleft
      label: Margin left
      description: the left margin
      value:
        - control: range
          value: 40
          min: 20
          max: 200
    - name: marginbottom
      label: Margin Bottom
      description: the bottom margin
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

data = await hal9.utils.toRows(data);
if (data == null) {
    throw 'No input data defined. Please use an import block to import data before visualizing it.'
  }

if (data.length > 10000) {
  throw(`Up to 10,000 data points are supported for this visualization, but ${data.length} were provided.`);
}
if (x == null){
    throw 'Please select a column for the x-axis'
  }
  if (y == null){
    throw 'Please select a column for the y-axis'
  }
if (y && !Array.isArray(y)) y = [y];
if (!y) y = [];

const chartdata = x && y.length
 ? y.reduce((res, yv, i) => {
     data.forEach(v => {
       res.push({
         x: v[x],
         y: hal9.utils.convert(v[yv]),
         z: yv,
       });
     });
     return res;
   }, [])
 : [];

const distAxis = orientation === 'vertical' ? 'x' : 'y';
const valueAxis = orientation === 'vertical' ? 'y' : 'x';

const distAxisName = distAxis.toUpperCase();
const valueAxisName = valueAxis.toUpperCase();

const getTitle = d => {
  const values = d.map(d => d.y);
  const summ = Math.round(d3.sum(values) * 100) / 100;

  return `${d[0].z}: ${summ} ([${values.join(', ')}])`;
};

const group = type === 'stacked'
  ? Plot.groupZ(
      { [valueAxis]: 'sum' },
      { [distAxis]: 'z', [valueAxis]: 'y', fill: 'z', title: d => getTitle(d) }
    )
  : Plot[`group${distAxisName}`](
      { [valueAxis]: 'sum' },
      { [distAxis]: 'z', [valueAxis]: 'y', fill: 'z', title: d => getTitle(d) }
    );

const legend = hal9.utils.createLegend({ names: y, colors: d3[palette] });
const marks = x && y.length ? [Plot[`bar${valueAxisName}`](chartdata, group)] : [];
const plot = Plot.plot({
  marks,
  [distAxis]: {
    axis: null,
  },
  [valueAxis]: {
    grid: true,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  color: {
    range: d3[palette],
  },
  facet: {
    data: chartdata,
    [distAxis]: 'x',
    marginBottom: marginbottom,
  },
  [`f${distAxis}`]: {
    label: null,
    domain: chartdata.map(e => e['x']),
    tickRotate: tickrotation,
  },
  width: html.clientWidth,
  height: html.clientHeight,
  marginTop: 30,
  marginLeft: parseInt(marginleft),
  marginBottom: marginbottom,
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
    fontSize: parseInt(fontsize),
  },
});

legend.style.color = hal9.isDark() ? 'white' : '';

html.appendChild(legend);
html.appendChild(plot);
