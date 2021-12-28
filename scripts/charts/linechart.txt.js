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
    - name: domainx
      label: Domain
      value:
        - control: select
          value: auto
          values:
            - name: auto
              label: Auto
            - name: all
              label: All
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

if (y && !Array.isArray(y)) y = [y];
if (!y) y = [];

const chartdata = x && y.length
 ? data.map(v => {
     const value = { x: hal9.utils.convert(v[x]) };
     y.map((yv, i) => {
       value[`y${i}`] = hal9.utils.convert(v[yv]);
     });
     return value;
   })
 : [];

const legend = hal9.utils.createLegend({ names: y, colors: d3[palette] });
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
    domain: domainx == 'auto' ? undefined : chartdata.map(e => e['x'])
  },
  y: {
    grid: true,
    inset: 10,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
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
