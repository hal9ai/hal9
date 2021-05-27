/**
  output: [ html ]
  params:
    - name: source
      label: Source
    - name: target
      label: Target
    - name: value
      label: Value
  deps: ['d3.v6.min.js', 'd3-sankey.min.txt.js', 'chart.js', 'grid-chart.js', 'xy-chart.js', 'sankey-chart.js', 'chart-utils.js']
**/

const style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode(`
  .d3-sankey-links path {
    fill: none;
    stroke: ${ hal9.isDark() ? '#fff' : '#000' };
    stroke-opacity: .1;
  }
  .d3-sankey-links path:hover {
    stroke-opacity: .4;
  }
  text {
    fill: ${ hal9.isDark() ? '#999' : '#000' };
  }
`));
html.appendChild(style);

const uniques = { source: {}, nodes: {} };

data.forEach(v => {
  if (typeof(uniques.nodes[v[source]]) == 'undefined') {
    uniques.nodes[v[source]] = Object.keys(uniques.nodes).length;
  }
  if (typeof(uniques.nodes[v[target]]) == 'undefined') {
    uniques.nodes[v[target]] = Object.keys(uniques.nodes).length;
  }

  const sourceid = uniques.nodes[v[source]];
  const targetid = uniques.nodes[v[target]];

  if (!uniques.source[sourceid]) {
    uniques.source[sourceid] = {};
  }

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
        source: convert(i),
        target: convert(j),
        value: targets[j],
      });
    }
  }
}

const chart = new SankeyChart(sankey);

chart.appendTo(wrapper(html));
