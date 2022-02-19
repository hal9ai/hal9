/**
  output: [html]
  params:
    - x
    - y
    - name: chartType
      label: 'Chart View'
      value:
        - control: 'select'
          value: ''
          values:
            - name: whole
              label: Whole
            - name: portion
              label: Portion
    - name: isDataCurrency
      label: 'Currency data'
      value:
        - control: 'select'
          value: ''
          values:
            - name: true
              label: Yes
            - name: false
              label: No
    - name: wafflesizelabel
      label: 'waffle size recommended(whole 250, portion100)'
      value:
        - control: 'textbox'
          value: '10'

  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
  author: analyzer2004
**/

data = await hal9.utils.toRows(data);

//ratio column
const total = data.reduce((a, b) => a + Math.abs(b[y]), 0);
data = data.map(d => ({
    [x]: d[x],
    [y]: d[y],
    ratio: d[y] / total * 100
}))

let chartData = data;
chartData.map(e => {
})
//sizes for the chart
let width = html.clientWidth;
let height = html.clientHeight;

//padding
let padding = { x: 10, y: 40 }

//whole or portion
var options = {
    style: "whole",
    shape: "rect"
};
whole = options.style === "whole"
isRect = options.shape === "rect"
if (chartType == 'whole') {
    whole = true;
}
else {
    whole = false;
    //4-3charts, for each row
    let sizeToFit = chartData.length * 6;
    height = html.clientHeight + sizeToFit;
}

//waffles data array create
const array = [];
if (whole) {
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
}
else {
    chartData.map((d, i) => {
        let curr = 0, waffle = [];
        for (let y = 9; y >= 0; y--)
            for (let x = 0; x < 10; x++) {
                waffle.push(({ x, y, index: curr < Math.round(d.ratio) ? i : -1 }));
                curr++;
            }
        array.push(waffle);
    });
}
let waffles = array;

//fun -> sequence of data length [1,2,3,4,5,6,]
let sequence = (length) => Array.apply(null, { length: length }).map((d, i) => i);

//each waffle size
let waffleSize = whole ? width < height ? width : height : 120;

//fun-> color of each waffle index
let color = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(sequence(chartData.length))

//fun -> convert to currency
if (isDataCurrency.length !== 0) {
    toCurrency = num => d3.format("$,.2f")(num);
}
else {
    toCurrency = num => d3.format(",.2f")(num);

}

//create svg, container of legend and waffles 
if (chartType == 'whole') {
    var legendChartpadding = parseFloat(wafflesizelabel) + 20;
    var svg = d3.create("svg")
        .style("cursor", "default")
        .attr("viewBox", [0, 0, width, height + parseFloat(wafflesizelabel / 8)]);
    html.appendChild(svg.node())
}
else {
    var legendChartpadding = 0.5;
    var svg = d3.create("svg")
        .style("cursor", "default")
        .attr("viewBox", [0, 0, width, height + 300]);
    html.appendChild(svg.node())
}
//container for the squares 
const g = svg.selectAll(".waffle")
    .data(waffles)
    .join("g")
    .attr("class", "waffle");

//for portion charts
if (!whole) {
    const numPerRow = Math.floor(width / (waffleSize + padding.x + 20));
    g.attr("transform", (d, i) => {
        const r = Math.floor(i / numPerRow);
        const c = i - r * numPerRow;
        return `translate(${c * (waffleSize + padding.x)},${r * (waffleSize + padding.y)})`
    });
}

//scale for the squares 
let scale;
if (whole) {
    scale = d3.scaleBand()
        .domain(sequence(10))
        //works with 300 fine 
        .range([0, parseFloat(wafflesizelabel)])
        .padding(0.1)

}
else {
    scale = d3.scaleBand()
        .domain(sequence(10))
        //works with 100 fine
        .range([0, parseFloat(wafflesizelabel)])
        .padding(0.1)

}
//assign color for the squares, each index, unique color
const cellSize = scale.bandwidth();
const half = cellSize / 2;
const cells = g.append("g")
    .selectAll(options.shape)
    .data(d => d)
    .join(options.shape)
    .attr("fill", d => d.index === -1 ? "#ddd" : color(d.index));

//assign each rect or not rect a size
if (isRect) {
    cells.attr("x", d => scale(d.x))
        .attr("y", d => whole ? 0 : scale(d.y))
        .attr("rx", 3).attr("ry", 3)
        .attr("width", cellSize).attr("height", cellSize)
}
else {
    cells.attr("cx", d => scale(d.x) + half)
        .attr("cy", d => whole ? 0 : scale(d.y) + half)
        .attr("r", half);
}
//if whole vizualization, assign a position in the graph
if (whole) {
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
}
else {
    g.append("text")
        .style("font-size", 20)
        .style("font-weight", "bold")
        .attr("dy", "1.5em")
        .attr("text-anchor", "middle")
        .attr("fill", (d, i) => color(i))
        .attr("transform", `translate(${waffleSize / 2},0)`)
        .text((d, i) => `${chartData[i].ratio.toFixed(0)}%`);

    g.append("g")
        .attr("transform", `translate(0,${waffleSize + padding.y / 2.50})`)
        .call(g => g.append("text").text((d, i) => chartData[i][x]))
        .call(g => g.append("text").attr("dy", "1em").text((d, i) => toCurrency(chartData[i][y])));
}

//draw legend 
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
