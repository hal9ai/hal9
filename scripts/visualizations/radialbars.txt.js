/**
  output: [ html ]
  params:
    - name: x
      label: Label
    - name: y
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
  credit:
    - name: analyzer2004
    - url: https://twitter.com/analyzer2004
**/

data = await hal9.utils.toRows(data);
barThinkness = Math.min(100 / data.length, 20);

let chartData = data.map(d => {
  return {
    [x]: d[x],
    values: d[y]
  }
})

// color for each bar
let color = d3.scaleOrdinal(d3[palette])
  .domain(chartData.map(d => d[x]))

// sequence func for chartdata
let seq = (length) => Array.apply(null, { length: length }).map((d, i) => i);

// max value of chartdata
let maxValue = d3.max(chartData.map(d => d.values));

// sizes for the chart 
let width = html.clientWidth;
let height = html.clientHeight;

let margin = ({ top: 20, left: 0, bottom: 30, right: 30 });

// bars
let bar = ({ width: barThinkness, padding: 4 });
let radialStart = 3 * width / 4 - margin.right;
console.log('radialStart: ' + radialStart)
let triangle = ({ width: bar.width / 2, height: bar.width, padding: 2, num: 3 });
let triangleAllWidth = triangle.width + 2 * triangle.padding;
console.log('triangle.width ' + triangle.width)
let start = ({ left: 100, right: null, padding: 6 });
let numOfBars = chartData.length;

// bars inner radius, max_min radius
let barsTotalHeight = data.length * (bar.width + bar.padding);
let maxRadius = Math.max(Math.min(width / 4, height / 3), barsTotalHeight);
let maxCircle = barsTotalHeight >= maxRadius ? 0.5 : 1.5;
let outerRadius = i => maxRadius - (bar.width + bar.padding) * i;
let innerRadius = i => outerRadius(i) - bar.width;

let minRadius = innerRadius(data.length - 1);

let deg = a => a * 180 / Math.PI;

// arc function
let arc = (d, i) => d3.arc()
  .innerRadius(innerRadius(i))
  .outerRadius(outerRadius(i))
  .startAngle(0)
  .endAngle(x_scaler(d.values))()

// axisarc
let axisArc = i => d3.arc()
  .innerRadius(outerRadius(i) + bar.padding / 2)
  .outerRadius(outerRadius(i) + bar.padding / 2)
  .startAngle(0)
  .endAngle(maxCircle * Math.PI)()

let x_scaler = d3.scaleLinear()
  .domain([0, maxValue * 1.05])
  .range([0, maxCircle * Math.PI])

// title for the chart
let title = g => g.append("title").text(d => `${y} - ${d[x]}\n${d3.format(",.2f")(d.values)}`);

let restore = () => {
  parts.start.transition().duration(500).attr("opacity", 1);
  parts.bar.transition().duration(500).attr("opacity", 1);
}

// highlight the bar
let highlight = (e, d) => {
  parts.start.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
  parts.bar.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
}

let parts = ({ start: null, bar: null })

// draw radial bars
drawRadialBars = (g, tspace) => {
  const ticks = x_scaler.ticks(15).slice(1, -1);
  ticks.push(maxValue * 1.05);
  g.attr("transform", `translate(${radialStart}, ${maxRadius + margin.top})`);

const marks = g.append("g")
  .selectAll(".tick")
  .data(ticks)
  .join("g")
  .attr("class", "tick")
  .attr("transform", d => `rotate(${deg(x_scaler(d)) - 90})`)
  .call(g => g.append("line").attr("x1", maxRadius - bar.padding / 2).attr("x2", maxRadius + bar.padding / 2))
  .call(g => g.append("text")
    .attr("class", "tick")
    .attr("transform", d => `translate(${maxRadius + bar.padding * 1.5},0)`)
    .text(x_scaler.tickFormat(1, ".1s")));

  const bars = g.selectAll(".bar")
    .data(chartData)
    .join("g")
    .attr("class", "bar")
    .attr("opacity", 1)
    .attr("fill", d => color(d[x]))
    .call(g => g.append("path").attr("d", arc))
    .call(g => g.append("circle")
      .attr("r", bar.width / 2)
      .attr("cx", (d, i) => outerRadius(i) - bar.width / 2)
      .attr("transform", (d, i) => `rotate(${deg(x_scaler(d.values)) - 90})`))
    .call(title)
    .on("mouseover", bar.width > 5 ? highlight : undefined)
    .on("mouseout", restore);

  parts.bar = bars;
}

// draw startlines
drawStartLines = g => {
  const starts = g.selectAll(".start")
    .data(chartData)
    .join("g")
    .attr("opacity", 1)
    .attr("fill", d => color(d[x]))
    .attr("transform", (d, i) => `translate(${bar.width + margin.left}, ${ maxRadius - outerRadius(i) + margin.top})`)
    .call(g => g.append("circle").attr("cy", bar.width / 2).attr("r", bar.width / 2))
    .call(g => g.append("rect").attr("width", start.left).attr("height", bar.width))
    .call(title)
    .on("mouseover", highlight)
    .on("mouseout", restore);

    var texts = starts.append("text")
      .attr("class", "start")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "hanging")
      .attr("dx", start.left + start.padding)
      .attr("dy", 2)
      .text(d => `${d[x]} ${d3.format(".2s")(d.values)}`);

  var widths = texts.nodes().map(d => d.getComputedTextLength());

  const ext = d3.extent(widths);
  const min = ext[0], max = ext[1];
  starts.append("rect")
    .attr("width", (d, i) => radialStart - (widths[i] + start.left + start.padding) - triangle.num * triangleAllWidth - 3 / 2 * bar.width - margin.left)
    .attr("height", bar.width)
    .attr("transform", (d, i) => `translate(${widths[i] + start.left + start.padding * 2}, 0)`)

  const startTriangle = radialStart - triangle.num * triangleAllWidth;
  starts.append("g")
    .selectAll("polygon")
    .data(seq(triangle.num))
    .join("polygon")
    .attr("points", `0,2 ${triangle.width},${triangle.width} 0,${triangle.height - 2}`)
    .attr("transform", (d, i) => `translate(${startTriangle - bar.width + i * (triangle.width + triangle.padding) + 2 * triangle.padding - margin.left},0)`);

  const startLength = start.left + start.right + start.padding * 2 + max + bar.width + (triangle.num ? 3 : 0);
  starts.append("g")
    .selectAll("polygon")
    .data(seq(triangle.num))
    .join("polygon")
    .attr("points", `0,2 ${triangle.width},${triangle.width} 0,${triangle.height - 2}`)
    .attr("transform", (d, i) => `translate(${startLength - bar.width + i * (triangle.width + triangle.padding)},0)`);

  g.selectAll(".track")
    .data(seq(chartData.length + 1))
    .join("path")
    .attr("class", "track")
    .attr("stroke", "#ccc")
    .attr("d", axisArc)
    .attr("transform", `translate(${radialStart}, ${maxRadius + margin.top})`);

  const y = d => innerRadius(d) + bar.width + bar.padding / 2 - minRadius + margin.top,
    tspace = startLength + (triangle.width + triangle.padding) * triangle.num;
  g.selectAll("line")
    .data(seq(numOfBars + 1))
    .join("line")
    .attr("stroke", "#ccc")
    .attr("x1", bar.width).attr("y1", y)
    .attr("x2", radialStart).attr("y2", y);

  parts.start = starts;

  return tspace;
}

// chart svg
const svg = d3.create("svg")
  .attr("font-size", (barThinkness * 0.7) + "pt")
  .attr("cursor", "default")
  .attr("viewBox", [0, 0, width, height]);

document.body.append(svg.node());

svg.append("g").call(g => drawStartLines(g));
svg.append("g").call(g => drawRadialBars(g));

const svgEl = svg.node();
html.appendChild(svgEl);
