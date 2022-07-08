/**
  output: [html]
  description: Visualize values as percentage of a shared rectagular area.
  params:
    - name: x
      label: Label
      single: true
      description: The column containing the labels of the charts
    - name: 'y'
      label: Value
      single: true
      description: the column containing the values the areas they occupy in the rectagular area should be propotional to
    - name: wafflesizelabel
      label: 'Size'
      description: The size of the large rectangle
      value:
        - control: 'number'
          value: '250'
    - name: palette
      label: D3 Palette
      description: the D3 Palette to determine the color scheme to use
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
  credit:
    - name: analyzer2004
    - url: https://twitter.com/analyzer2004
**/

data = await hal9.utils.toRows(data);

// ratio column
const total = data.reduce((a, b) => a + Math.abs(b[y]), 0);
data = data.map(d => ({
    [x]: d[x],
    [y]: d[y],
    ratio: d[y] / total * 100
}))

let chartData = data;
chartData.map(e => {})

// sizes for the chart
let width = html.clientWidth;
let height = html.clientHeight;

// padding
let padding = { x: 10, y: 40 }

// whole or portion
var options = {
    style: "whole",
    shape: "rect"
};
isRect = options.shape === "rect"

// waffles data array create
const array = [];

const max = chartData.length;
let index = 0, curr = 1,
    accu = Math.round(chartData[0].ratio), waffle = [];
for (let y = 9; y >= 0; y--)
    for (let x = 0; x < 10; x++) {
        if (curr > accu && index < max) {
            if (chartData.length - 1 == index) {
                //pass
            }
            else {
                let r = Math.round(chartData[++index].ratio);
                while (r === 0 && index < max) r = Math.round(chartData[++index].ratio);
                accu += r;
            }
        }

        waffle.push({ x, y, index });
        curr++;
    }
array.push(waffle);

let waffles = array;

// fun -> sequence of data length [1,2,3,4,5,6,]
let sequence = (length) => Array.apply(null, { length: length }).map((d, i) => i);

// each waffle size
let waffleSize = width < height ? width : height;

// fun-> color of each waffle index
let color = d3.scaleOrdinal(d3[palette])
    .domain(sequence(chartData.length))

// fun -> convert to currency
toCurrency = num => d3.format(",.2f")(num);

// create svg, container of legend and waffles
var legendChartpadding = parseFloat(wafflesizelabel) + 20;
var svg = d3.create("svg")
    .style("cursor", "default")
    .attr("viewBox", [0, 0, width, height + parseFloat(wafflesizelabel / 8)]);
html.appendChild(svg.node())

// container for the squares
const g = svg.selectAll(".waffle")
    .data(waffles)
    .join("g")
    .attr("class", "waffle");

// scale for the squares
let scale = d3.scaleBand()
  .domain(sequence(10))
  // works with 300 fine
  .range([0, parseFloat(wafflesizelabel)])
  .padding(0.1)

// assign color for the squares, each index, unique color
const cellSize = scale.bandwidth();
const half = cellSize / 2;
const cells = g.append("g")
    .selectAll(options.shape)
    .data(d => d)
    .join(options.shape)
    .attr("fill", d => d.index === -1 ? "#ddd" : color(d.index));

// assign each rect or not rect a size
if (isRect) {
    cells.attr("x", d => scale(d.x))
        .attr("y", d => 0)
        .attr("rx", 3).attr("ry", 3)
        .attr("width", cellSize).attr("height", cellSize)
}
else {
    cells.attr("cx", d => scale(d.x) + half)
        .attr("cy", d => 0)
        .attr("r", half);
}
// if whole vizualization, assign a position in the graph

cells.append("title").text(d => {
    const cd = chartData[d.index];
    return `${cd[x]}\n${toCurrency(cd[y])} (${cd.ratio.toFixed(1)}%)`;
});

cells.transition()
    .duration(d => d.y * 100)
    .ease(d3.easeBounce)
    .attr(isRect ? "y" : "cy", d => scale(d.y) + (isRect ? 0 : half));
svg.transition().delay(550)
    .on("end", () => drawLegend(svg, cells));

// draw legend
let drawLegend = (svg, cells) => {
    const legend = svg.selectAll(".legend")
        .data(chartData.map(d => d[x]))
        .join("g")
        .attr("opacity", 1)
        .attr("transform", (d, i) => `translate(${legendChartpadding},${i * 17.5})`)
        .on("mouseover", highlight)
        .on("mouseout", restore);

    legend.append("rect")
        .attr("rx", 3).attr("ry", 3)
        .attr("width", 30).attr("height", 15)
        .attr("fill", (d, i) => color(i));

    legend.append("text")
        .attr("dx", 40)
        .attr("alignment-baseline", "hanging")
        .text((d, i) => `${d} (${chartData[i].ratio.toFixed(1)}%)`);

    function highlight(e, d, restore) {
        const i = legend.nodes().indexOf(e.currentTarget);
        cells.transition().duration(500)
            .attr("fill", d => d.index === i ? color(d.index) : "#ccc");
    }
    function restore() {
        cells.transition().duration(500).attr("fill", d => color(d.index))
    }
}
