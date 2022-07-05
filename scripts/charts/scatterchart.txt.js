/**
  output: [html]
  params:
    - name: x
      label: x
      static: false
    - name: y
      label: y
      static: false
    - name: color
      label: color
      static: false
    - name: size
      label: size
      static: false
    - name: label
      label: label 
      static: false
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
          value: 40
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

const chartdata = x && y
 ? data.map(v => ({
     x: hal9.utils.convert(v[x]),
     y: hal9.utils.convert(v[y]),
     color: v[color] + '',
     size: hal9.utils.convert(v[size]),
     label: v[label] ? (v[label].substring(0, 10) + (v[label].length > 10 ? '...' : '')) : '',
   }))
 : [];

const getTitle = d => {
  const x = Math.round(d.x * 100) / 100;
  const y = Math.round(d.y * 100) / 100;

  const size = d.size ? Math.round(d.size * 100) / 100 : 0;
  const color = typeof d.color === 'string' ? d.color : Math.round(d.color * 100) / 100;

  const title = `x: ${x}\ny: ${y}` +
    (d.size ? `\nradius: ${size}` : '') +
    (d.color ? `\ncolor: ${color}` : '');

  return title;
};

var colorUniques = data.map(e => e[color]).filter((v, i, a) => a.indexOf(v) === i);
const legend = hal9.utils.createLegend({ names: colorUniques, colors: d3[palette] });
legend.style.color = hal9.isDark() ? 'white' : '';

if (color) html.appendChild(legend);

var plotScheme = palette.replace('scheme','');
html.appendChild(Plot.plot({
  marks: [colorUniques.map((_, i) => {
    return Plot.dot(chartdata, {
      x: x ? 'x' : [],
      y: y ? 'y' : [],
      r: size ? 'size' : 5,
      fill: color ? 'color' : d3.schemeTableau10[0],
      title: d => getTitle(d),
    })
  }),
  Plot.text(chartdata, {x: "x", y: "y", text: d => d.label, dy: -10})
  ],
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
  marginTop: 30,
  marginLeft: parseInt(marginleft),
  marginBottom: parseInt(marginbottom),
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
    fillOpacity: 1,
    fontSize: parseInt(fontsize),
  },
  color: {
    scheme: color ? plotScheme : undefined,
  },
}));
