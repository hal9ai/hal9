/**
  output: [ html ]
  params: [ label, size ]
  deps:
    - 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js'
    - 'https://cdn.rawgit.com/jasondavies/d3-cloud/v1.2.1/build/d3.layout.cloud.js'
**/

if (data.length > 1000) {
  throw('Up to 1000 data points are supported in this visualization, but ' + data.length + ' provided.');
}

var width = html.offsetWidth;
var height = html.offsetHeight;

var minSize = size ? Math.min.apply(null, data.map(e => e[size])) : 1;
var maxSize = size ? Math.max.apply(null, data.map(e => e[size])) : 1;
const wordsMap = data.map(e => {
  return { text: ('' + e[label]), size: (size ? 40 * ((e[size] - minSize) / (maxSize - minSize)) + 5 : 20) }
});

var fill = d3.scale.category20();
var svg = d3.select(html).append("svg");

d3.layout.cloud()
  .size([width, height])
  .words(wordsMap)
  .rotate(function() {
    return ~~(Math.random() * 2) * 90;
  })
  .font("Impact")
  .fontSize(function(d) {
    return d.size;
  })
  .on("end", drawCloud)
  .start();

function drawCloud(words) {
  svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + ~~(width / 2) + "," + ~~(height / 2) + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) {
      return d.size + "px";
    })
    .style("-webkit-touch-callout", "none")
    .style("-webkit-user-select", "none")
    .style("-khtml-user-select", "none")
    .style("-moz-user-select", "none")
    .style("-ms-user-select", "none")
    .style("user-select", "none")
    .style("cursor", "default")
    .style("font-family", "Impact")
    .style("fill", function(d, i) {
      return fill(i);
    })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) {
      return d.text;
    });
  }

var bbox = svg.node().getBBox();
var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
svg.node().setAttribute("viewBox", viewBox);
