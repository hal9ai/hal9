/**
  output: [html]
  params:
    - name: label
      label: Label
    - name: size
      label: Size
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

if (data.length > 10000) {
  throw(`Up to 10,000 data points are supported for this visualization, but ${data.length} were provided.`);
}

const groupBy = (values, key) =>
  values.reduce((res, v) => {
    res[v[key]] = res[v[key]] || [];
    res[v[key]].push(v);

    return res;
  }, {});

const groupedData = groupBy(data, label);
const chartData = {
  name: 'root',
  children: Object.keys(groupedData).map(group => ({
    name: group,
    children: groupedData[group].map(g => ({
      name: g[label] || g[size],
      value: g[size],
    })),
  })),
};

const hierarchy = d3.hierarchy(chartData).sum(d => d.value);

d3.treemap()
  .size([html.clientWidth, html.clientHeight])
  .padding(2)
  (hierarchy);

const leaves = hierarchy.leaves();

const getTitle = d => {
  return `name: ${d.data.name}\nvalue: ${Math.round(d.value * 100) / 100}`;
};

const legend = hal9.utils.createLegend({
  names: [...new Set(leaves.map(l => l.data.name))].filter(Boolean).sort((a, b) => a - b),
  colors: d3[palette],
});
const plot = Plot.plot({
  marks: [
    Plot.rect(leaves, {
      x1: 'x0', x2: 'x1',
      y1: 'y0', y2: 'y1',
      fill: d => d.data.name,
      title: d => getTitle(d),
    }),
    Plot.text(leaves, {
      x: 'x0', y: 'y1',
      dx: 10, dy: 10,
      text: d => {
        const v = d.value?.toFixed(1);
        const width = (v.length - 1) * 8 + 5;
        const height = 15;

        return (d.x1 - d.x0 > width && d.y1 - d.y0 > height) ? v : '';
      },
      fill: '#fff',
    }),
  ],
  x: { axis: null },
  y: { axis: null },
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

legend.style.color = hal9.isDark() ? 'white' : '';

html.appendChild(legend);
html.appendChild(plot);
