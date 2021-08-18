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
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@0.0.4/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
    - https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1
**/

data = await hal9.utils.toRows(data);
 
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
  },
  [`f${distAxis}`]: {
    label: null,
  },
  width: html.clientWidth,
  height: html.clientHeight,
  marginTop: 30,
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : ''
  },
});

legend.style.color = hal9.isDark() ? 'white' : '';

html.appendChild(legend);
html.appendChild(plot);
