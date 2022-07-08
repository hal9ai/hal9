/**
  output: [html]
  description: Visualize the data as marks in a cartesian plane
  params:
    - name: x
      label: x
      description: The column containing the x coordinates of the marks
      single: true
      static: false
    - name: 'y'
      label: 'y'
      description: The column containing the y coordinates of the marks
      single: true
      static: false
    - name: color
      label: color
      description: The column that should be used to group the marks into different colors
      single: true
      static: false
    - name: size
      label: size
      description: The column the marks should be propotional in area to.
      single: true
      static: false
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
      description: The size of the font to be used
      value:
        - control: range
          value: 16
          min: 5
          max: 20
    - name: marginleft
      description: The left margin
      label: Margin left
      value:
        - control: range
          value: 40
          min: 20
          max: 200
    - name: marginbottom
      description: The Bottom margin
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
