/**
  output: [html]
  params:
    - name: source
      label: Source
    - name: target
      label: Target
    - name: value
      label: Value
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
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
    - https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3
    - https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1
**/

data = await hal9.utils.toRows(data);

const uniques = { source: {}, nodes: {} };

data.forEach(v => {
  if (typeof(uniques.nodes[v[source]]) === 'undefined') {
    uniques.nodes[v[source]] = Object.keys(uniques.nodes).length;
  }
  if (typeof(uniques.nodes[v[target]]) === 'undefined') {
    uniques.nodes[v[target]] = Object.keys(uniques.nodes).length;
  }

  const sourceid = uniques.nodes[v[source]];
  const targetid = uniques.nodes[v[target]];

  uniques.source[sourceid] = uniques.source[sourceid] || {};
  uniques.source[sourceid][targetid] = value
    ? v[value]
    : (!uniques.source[sourceid][targetid] ? 1 : (uniques.source[sourceid][targetid] + 1));
});

const sankey = { nodes: [], links: [] };

for (i in uniques.nodes) {
  sankey.nodes.push({ id: uniques.nodes[i], name: i });
}

for (i in uniques.source) {
  const targets = uniques.source[i];

  for (j in targets) {
    if (i != j) {
      sankey.links.push({
        source: hal9.utils.convert(i),
        target: hal9.utils.convert(j),
        value: targets[j],
      });
    }
  }
}

d3.sankey()
  .nodeWidth(20)
  .nodePadding(html.clientHeight / sankey.nodes.length)
  .size([html.clientWidth, html.clientHeight])
  (sankey);

const links = sankey.links.map((l, i) => ([
  { x: l.source.x1, y0: l.y0 + l.width / 2, y1: l.y0 - l.width / 2, i },
  { x: l.target.x0, y0: l.y1 + l.width / 2, y1: l.y1 - l.width / 2, i }
]));

const getTitle = d => {
  const link = sankey.links[d.i];
  const source = link.source.name;
  const target = link.target.name;

  const title = `source: ${typeof source === 'string' ? source.toLocaleString() : source}\n` +
    `target: ${typeof target === 'string' ? target.toLocaleString() : target}\n` +
    `value: ${Math.round(link.value * 100) / 100}`;

  return title;
};

html.appendChild(Plot.plot({
  marks: [
    links.map(link =>
      Plot.areaY(link, {
        x: "x",
        y1: "y0", y2: "y1",
        curve: "bump-x",
        fill: "#000",
        fillOpacity: 0.1,
        order: "value",
        title: d => getTitle(d),
      })
    ),
    Plot.rect(sankey.nodes, {
      x1: 'x0', x2: 'x1',
      y1: 'y0', y2: 'y1',
      fill: 'name',
    }),
    Plot.text(sankey.nodes.filter(d => d.x0 < html.clientWidth / 2), {
      x: 'x1', dx: 5,
      y: d => ((d.y1 + d.y0) / 2),
      text: 'name',
      textAnchor: 'start',
    }),
    Plot.text(sankey.nodes.filter(d => d.x0 >= html.clientWidth / 2), {
      x: 'x0', dx: -5,
      y: d => ((d.y1 + d.y0) / 2),
      text: 'name',
      textAnchor: 'end',
    }),
  ],
  x: { axis: null },
  y: { axis: null },
  color: { range: d3[palette] },
  width: html.clientWidth,
  height: html.clientHeight,
  marginTop: 40,
  marginBottom: 10,
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
  },
}));
