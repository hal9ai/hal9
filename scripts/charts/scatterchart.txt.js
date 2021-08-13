/**
  output: [html]
  params: 
    - x
    - y
    - color
    - size
    - label
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
  deps: [
    'chart-utils.js',
    'https://cdn.jsdelivr.net/npm/d3@6',
    'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1',
  ]
**/

const chartdata = x && y
 ? data.map(v => ({
     x: convert(v[x]),
     y: convert(v[y]),
     color: convert(v[color]),
     size: convert(v[size]),
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
const legend = createLegend({ names: colorUniques, colors: d3[palette] });
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
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
    fillOpacity: 1,
  },
  color: {
    scheme: color ? plotScheme : undefined,
  },
}));
