/**
  output: [html]
  description: Highlight words with their sizes
  params:
    - name: label
      label: Label
      description: The column containing words to be added to the cloud
      single: true
    - name: size
      label: Size
      single: true
      description: The column the size of the words should be in propotion to
  deps: [
    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js',
    'https://cdn.rawgit.com/jasondavies/d3-cloud/v1.2.1/build/d3.layout.cloud.js',
    'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js'
  ]
**/

data = await hal9.utils.toRows(data);
if (data.length > 1000) {
  throw('Up to 1000 data points are supported in this visualization, but ' + data.length + ' provided.');
}

const width = html.offsetWidth;
const height = html.offsetHeight;

const sizes = data.map(e => hal9.utils.convert(e[size]))
const sizeRange = size
  ? { min: Math.min(...sizes), max: Math.max(...sizes) }
  : { min: 1, max: 1 };

const wordsMap = label && size && typeof label === 'string' ?
  data.map(e => ({
    text: ('' + e[label]),
    size: (size ? 40 * ((e[size] - sizeRange.min) / (sizeRange.max - sizeRange.min)) + 5 : 20)
  })) : [];

const fill = d3.scale.category20();
const svg = d3.select(html).append('svg');

const drawCloud = (words) => {
  svg
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${~~(width / 2)},${~~(height / 2)})`)
    .selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .style('font-size', d => `${d.size}px`)
    .style('-webkit-touch-callout', 'none')
    .style('-webkit-user-select', 'none')
    .style('-khtml-user-select', 'none')
    .style('-moz-user-select', 'none')
    .style('-ms-user-select', 'none')
    .style('user-select', 'none')
    .style('cursor', 'default')
    .style('font-family', 'Impact')
    .style('fill', (_, i) => fill(i))
    .attr('text-anchor', 'middle')
    .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
    .text(d => d.text);
};

const viewBox = [0, 0, width, height].join(' ');

svg.node().setAttribute('viewBox', viewBox);

d3.layout
  .cloud()
  .size([width, height])
  .words(wordsMap)
  .rotate(() => ~~(Math.random() * 2) * 90)
  .font('Impact')
  .fontSize(d => d.size)
  .on('end', drawCloud)
  .start();
