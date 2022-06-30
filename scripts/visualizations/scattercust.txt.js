/**
  output: [ html ]
  params:
    - name: x
    - name: 'y'
    - name: color
    - name: size
  deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js' ]
**/

var margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = html.offsetWidth - margin.left - margin.right,
  height = html.offsetHeight - margin.top - margin.bottom;

var scalecolor = d3.scaleOrdinal().range(d3.schemeCategory10);

// Define the div for the tooltip
var div = d3.select(html).append("div")
    .attr("style", `
    position: absolute;
    text-align: center;
    width: 70px;
    height: 18px;
    padding: 2px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
    opacity: 0;
`);

var svg = d3.select(html)
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('fill', '#000')
  .append('g')
    .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');

var range = {
  xmin: d3.min(data, d => parseFloat(d[x])), xmax: d3.max(data, d => parseFloat(d[x])),
  ymin: d3.min(data, d => parseFloat(d[y])), ymax: d3.max(data, d => parseFloat(d[y])),
  sizemin: size ? d3.min(data, d => parseFloat(d[size])) : 1, sizemax: size ? d3.max(data, d => parseFloat(d[size])) : 1,
};

var axisx = d3.scaleLinear().domain([range.xmin, range.xmax]).range([ 0, width ]);
svg.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(axisx));

var axisy = d3.scaleLinear().domain([range.ymin, range.ymax]).range([ height, 0]);
svg.append('g')
  .call(d3.axisLeft(axisy));

var scalesize = d3.scaleLinear().domain([range.sizemin, range.sizemax]).range([ 3, 10]);

svg.append('g')
  .selectAll('dot')
  .data(data)
  .enter()
  .append('circle')
    .attr('cx', function (d) { return axisx(d[x]); } )
    .attr('cy', function (d) { return axisy(d[y]); } )
    .attr('fill', function (d) { return color ? scalecolor(d[color]) : '#8888FF66'; } )
    .attr('r', function (d) { return typeof(size) === 'number' ? size : scalesize(size ? d[size] : 1); } )
    .on("mouseover", function(e, d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.text((Math.round(d[y] * 100) / 100).toLocaleString())
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
