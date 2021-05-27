/**
  output: [ html ]
  params: [ from, to ]
  deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js' ]
**/

if (data.length > 1000) {
  throw('Up to 1000 data points are supported in this visualization, but ' + data.length + ' provided.');
}

var graph ={ nodes: [], links: [] };
var width = html.offsetWidth;
var height = html.offsetHeight;
var sizeMax = 1;

var nodeNameMap = {};
graph.nodes = data
  .map(e => {
    nodeNameMap[e[from]] = nodeNameMap[e[from]] ? nodeNameMap[e[from]] : {};
    nodeNameMap[e[to]] = nodeNameMap[e[to]] ? nodeNameMap[e[to]] : {};
    nodeNameMap[e[from]].count = nodeNameMap[e[from]].count ? nodeNameMap[e[from]].count + 1 : 1;
    nodeNameMap[e[to]].count = nodeNameMap[e[to]].count ? nodeNameMap[e[to]].count + 1 : 1;
    sizeMax = Math.max(sizeMax, Math.max(nodeNameMap[e[from]].count, nodeNameMap[e[to]].count))
    return e;
  })
  .map(e => {
    return e[from];
  })
  .concat(data.map(e => {
    return e[to];
  }))
  .filter((value, index, self) => {
    return self.indexOf(value) === index;
  })
  .map((e, idx) => {
    nodeNameMap[e].id = idx;
    return { id: idx, name: e, size: 25 * nodeNameMap[e].count / sizeMax + 5};
})
.sort((a,b) => a.size - b.size);

var strengthScale = d3.scaleLinear()
    .domain([d3.min(data, e => e[link]), d3.max(data, e => e[link])])
    .range([0, 1]);

graph.links = data.map(e => {
  return {
    source: nodeNameMap[e[from]].id,
    target: nodeNameMap[e[to]].id,
    strenght: strengthScale(e[link])
  };
})
var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 20));

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
      .id(function(d) { return d.id; })
      .strength(function(d) { return d.strenght ? d.strenght : 1 /* link */; })
    )
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2));

var svg = d3.select(html)
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr("font-family", "sans-serif")
  .attr("font-size", "20")
  .attr("text-anchor", "middle");

var link = svg.append("g")
    .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
    .attr("stroke", "#99999933")
    .attr("stroke-width", function(d) { return d.strenght ? 10 * d.strenght : 1 /* link */; });

var node = svg.append("g")
    .attr("class", "nodes")
  .selectAll("g")
  .data(graph.nodes)
  .enter().append("g");

node.append("circle");
node.select("circle")
    .attr("r", function(d) { return d.size ? d.size : 10 /* radius */ })
    .attr("fill", function(d) { return color(d.id); });

node.append("text");
node.select("text")
    .text(function(d) { return d.name; })
    .attr("fill", function(d) { return "#666"; })
    .attr("style", function(d) { return 'font-size: ' + (d.size ? d.size : 10 /* radius */) + 'px'; })
    .attr("y", function(d, i, nodes) { return 2 * (d.size ? d.size : 10 /* radius */); });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked() {
  node
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .attr("opacity", function(d) { return d.size/30 + 0.25; });
    
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}
