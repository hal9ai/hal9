/**
  output: [html]
  params:
    - label
    - size
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
    'https://cdn.jsdelivr.net/npm/hal9-utils@0.0.4/dist/hal9-utils.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js'
  ]
**/
data = await hal9.utils.toRows(data);

if (data.length > 1000) {
  throw(`Up to 1000 data points are supported in this visualization, but ${data.length} provided.`);
}

const sizes = data.map(e => hal9.utils.convert(e[size]))
const sizeRange = size
  ? { min: Math.min(...sizes), max: Math.max(...sizes) }
  : { min: 1, max: 1 };

const normalize = (size) => (sizeRange.max !== sizeRange.min
  ? 40 * (size - sizeRange.min) / (sizeRange.max - sizeRange.min) + 5
  : 1);

const width = html.offsetWidth;
const height = html.offsetHeight;

const svg = d3.select(html)
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', '#00000077');

svg
  .attr('font-family', 'sans-serif')
  .attr('font-size', 8)
  .attr('text-anchor', 'middle');

const svgSize = 600;
const pack = d3.pack()
  .size([svgSize, svgSize])
  .padding(1.5);

const chartid = Math.floor(Math.random() * 1000);

const format = d3.format(',d');
const colorPalette = d3.scaleOrdinal(d3[palette]);

const group = svg.append('g');

const root = d3.hierarchy({ children: data })
  .sum(d => (size ? normalize(d[size]) : 1))
  .each((d, idx) => {
    const id = (d.data[label] || '') + '';
    const i = id.lastIndexOf('.');

    d.id = `${chartid}.${idx}`;
    d.package = id.slice(0, i);
    d.class = id.slice(i + 1);
    d.words = d.class.split(' ').filter(w => w.length > 0);
  });

const node = group
  .selectAll('.node')
  .data(pack(root).leaves())
  .enter()
  .append('g')
  .attr('class', 'node')
  .attr('transform', d => `translate(${d.x},${d.y})`);

node
  .append('circle')
  .attr('id', d => d.id)
  .attr('r', d => d.r)
  .style('fill', d => colorPalette(d.package));

node
  .append('clipPath')
  .attr('id', d => `clip-${d.id}`)
  .append('use')
  .attr('xlink:href', d => `#${d.id}`);

node
  .append('text')
  .attr('x', 0)
  .attr('y', (d, i, nodes) => -d.r / 4 / 2 - ((d.words.length - 1) / 2 * (d.r / 4)))
  .attr('clip-path', d => `url(#clip-${d.id})`)
  .attr('style', (d, i, nodes) => `font-size: ${d.r / 2}px`)
  .selectAll('tspan')
  .data(d => d.words.map(x => Object.assign({ word: x }, d)))
  .enter()
  .append('tspan')
  .text(d => d.word)
  .attr('dy', d => (d.r / 4))
  .attr('x', 0);

const minSize = Math.min(width, height);

group.attr('transform', d =>
  `translate(${(width - minSize) / 2},${(height - minSize) / 2}),` +
  `scale(${minSize / svgSize},${minSize / svgSize})`
);
