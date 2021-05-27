/**
  output: [ html ]
  params: [ label, size ]
  deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js' ]
**/

if (data.length > 1000) {
  throw('Up to 1000 data points are supported in this visualization, but ' + data.length + ' provided.');
}

var minSize = size ? Math.min.apply(null, data.map(e => e[size])) : 1;
var maxSize = size ? Math.max.apply(null, data.map(e => e[size])) : 1;
var normalize = function(size) { return (maxSize == minSize ? 1 : 40 * (size - minSize) / (maxSize - minSize)) + 5; }

var width = html.offsetWidth;
var height = html.offsetHeight;
var svg = d3.select(html)
  .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#00000077');

svg.attr("font-family", "sans-serif")
  .attr("font-size", "8")
  .attr("text-anchor", "middle");
    
var svgSize = 600;
var pack = d3.pack()
  .size([svgSize, svgSize])
  .padding(1.5);
var chartid = Math.floor(Math.random() * 1000);
    
var format = d3.format(",d");
var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 10));

var group = svg.append("g");

var root = d3.hierarchy({children: data})
  .sum(function(d) { return size ? normalize(d[size]) : 1; })
  .each(function(d,idx) {
    if (id = (d.data[label] ? '' + d.data[label] : '')) {
      var id, i = id.lastIndexOf(".");
      d.id = chartid + '.' + idx;
      d.package = id.slice(0, i);
      d.class = id.slice(i + 1);
      d.words = d.class.split(' ').filter(w => w.length > 0)
    }
  });

var node = group.selectAll(".node")
  .data(pack(root).leaves())
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

node.append("circle")
    .attr("id", function(d) { return d.id; })
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return color(d.package); });

node.append("clipPath")
    .attr("id", function(d) { return "clip-" + d.id; })
  .append("use")
    .attr("xlink:href", function(d) { return "#" + d.id; });

node
   .append("text")
    .attr("x", 0)
    .attr("y", function(d, i, nodes) { return -d.r/4/2 - ((d.words.length - 1) / 2 * (d.r/4)) })
    .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .attr("style", function(d, i, nodes) { return 'font-size: ' + (d.r/4) + 'px'; })
  .selectAll("tspan")
  .data(d => d.words.map(x => Object.assign({ word: x }, d)))
  .enter().append("tspan")
    .text(function(d) { return d.word; })
    .attr("dy", d => (d.r/4))
    .attr("x", 0);

var minSize = Math.min(width, height);
group.attr("transform", function(d) {
  return "" +
    "translate(" + (width - minSize) / 2 + "," + (height - minSize) / 2 + ")," +
    "scale(" + (minSize / svgSize) + "," + (minSize / svgSize) + ")";
});
