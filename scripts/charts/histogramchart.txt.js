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
    - name: fontsize
      label: Font Size
      value:
        - control: range
          value: 16
          min: 5
          max: 20
    - name: marginleft
      label: Margin left
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

data = await hal9.utils.toRows(data);

const chartdata = x
  ? data.map(v => ({ x: hal9.utils.convert(v[x]), color: hal9.utils.convert(v[color]) }))
  : [];

const barAxis = orientation === 'vertical' ? 'x' : 'y';
const valueAxis = orientation === 'vertical' ? 'y' : 'x';

const barAxisName = barAxis.toUpperCase();
const valueAxisName = valueAxis.toUpperCase();

const getTitle = d => {
  const color = d[0].color;
  const title =
    (color ? `name: ${typeof color === 'string' ? color.toLocaleString() : color}\n` : '') +
    `count: ${d.length}`;

  return title;
}

const colors = [...new Set(chartdata.map(d => d.color))].filter(Boolean).sort((a, b) => a - b);
const legend = hal9.utils.createLegend({
  names: colors,
  colors: d3[palette],
});
const marks = x ? [
  Plot[`rect${valueAxisName}`](chartdata, Plot[`bin${barAxisName}`](
    { [valueAxis]: 'count' },
    {
      [barAxis]: 'x',
      thresholds: parseInt(thresholds),
      fill: color ? 'color' : d3[palette][0],
      title: d => getTitle(d),
    }
  )),
] : [];
const plot = Plot.plot({
  marks,
  [valueAxis]: {
    grid: true,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  color: {
    range: d3[palette],
  },
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

legend.style.color = hal9.isDark() ? 'white' : '';

html.appendChild(legend);
html.appendChild(plot);
