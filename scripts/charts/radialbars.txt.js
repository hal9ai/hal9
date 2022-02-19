/**
  output: [html]
  params:
    - x
    - y
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
    - name: minRadiuslabel
      label: 'Minradius'
      value:
        - control: 'textbox'
          value: '10'

  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
  author: analyzer2004
**/

data = await hal9.utils.toRows(data);

let chartData = data.map(d => {
  return {
    [x]: d[x],
    values: d[y]
  }
})

//Color for each bar
let color = d3.scaleOrdinal(d3.schemeTableau10)
  .domain(chartData.map(d => d[x]))

//sequence func for chartdata
let seq = (length) => Array.apply(null, { length: length }).map((d, i) => i);

//Max value of chartdata
let maxValue = d3.max(chartData.map(d => d.values));

//Sizes for the chart 
let width = html.clientWidth + 900;

let height = html.clientHeight + chartData.length * 50;


let margin = ({ top: 30, left: 0, bottom: 0, right: 0 });

//bars
let bar = ({ width: 12, padding: 8 });
let triangle = ({ width: bar.width / 2, height: bar.width, padding: 2, num: 3 });
let start = ({ left: 100, right: 350, padding: 5 });
let numOfBars = chartData.length;

//bars inner radius, max_min radius
let innerRadius = i => minRadius + (bar.width + bar.padding) * i;
let outerRadius = i => innerRadius(i) + bar.width

let minRadius = parseFloat(minRadiuslabel);
let maxRadius = outerRadius(numOfBars - 1);

let deg = a => a * 180 / Math.PI;

//arc function
let arc = (d, i) => d3.arc()
  .innerRadius(innerRadius(i))
  .outerRadius(outerRadius(i))
  .startAngle(0)
  .endAngle(x_scaler(d.values))()

//axisarc
let axisArc = i => d3.arc()
  .innerRadius(innerRadius(i) - bar.padding / 2)
  .outerRadius(innerRadius(i) - bar.padding / 2)
  .startAngle(0)
  .endAngle(1.5 * Math.PI)()

let x_scaler = d3.scaleLinear()
  .domain([0, maxValue * 1.05])
  .range([0, 1.5 * Math.PI])

//title for the chart
let title = g => g.append("title").text(d => `${y} - ${d[x]}\n${d3.format("$,.2f")(d.values)}`);

let restore = () => {
  parts.start.transition().duration(500).attr("opacity", 1);
  parts.bar.transition().duration(500).attr("opacity", 1);
}

//highlight the bar
let highlight = (e, d) => {
  parts.start.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
  parts.bar.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
}

let parts = ({ start: null, bar: null })

//draw radial bars
drawRadialBars = (g, tspace) => {
  const ticks = x_scaler.ticks(15).slice(1, -1);
  ticks.push(maxValue * 1.05);
  g.attr("transform", `translate(${tspace},${maxRadius + margin.top})`);

  if (isDataCurrency.length !== 0) {
    const marks = g.append("g")
      .selectAll(".tick")
      .data(ticks)
      .join("g")
      .attr("class", "tick")
      .attr("transform", d => `rotate(${deg(x_scaler(d)) - 90})`)
      .call(g => g.append("line").attr("x1", minRadius - bar.padding / 2).attr("x2", maxRadius + bar.padding / 2))
      .call(g => g.append("text")
        .attr("class", "tick")
        .attr("transform", d => `translate(${maxRadius + bar.padding * 1.5},0)`)
        .text(x_scaler.tickFormat(1, "$.1s")));
  }
  else {
    const marks = g.append("g")
      .selectAll(".tick")
      .data(ticks)
      .join("g")
      .attr("class", "tick")
      .attr("transform", d => `rotate(${deg(x_scaler(d)) - 90})`)
      .call(g => g.append("line").attr("x1", minRadius - bar.padding / 2).attr("x2", maxRadius + bar.padding / 2))
      .call(g => g.append("text")
        .attr("class", "tick")
        .attr("transform", d => `translate(${maxRadius + bar.padding * 1.5},0)`)
        .text(x_scaler.tickFormat(1, ".1s")));
  }
  const bars = g.selectAll(".bar")
    .data(chartData)
    .join("g")
    .attr("class", "bar")
    .attr("opacity", 1)
    .attr("fill", d => color(d[x]))
    .call(g => g.append("path").attr("d", arc))
    .call(g => g.append("circle")
      .attr("r", bar.width / 2)
      .attr("cx", (d, i) => innerRadius(i) + bar.width / 2)
      .attr("transform", (d, i) => `rotate(${deg(x_scaler(d.values)) - 90})`))
    .call(title)
    .on("mouseover", highlight)
    .on("mouseout", restore);

  g.selectAll(".track")
    .data(seq(chartData.length + 1))
    .join("path")
    .attr("class", "track")
    .attr("stroke", "#ccc")
    .attr("d", axisArc);

  parts.bar = bars;
}

//draw startlines
drawStartLines = g => {
  const starts = g.selectAll(".start")
    .data(chartData)
    .join("g")
    .attr("opacity", 1)
    .attr("fill", d => color(d[x]))
    .attr("transform", (d, i) => `translate(${bar.width},${innerRadius(numOfBars - 1 - i) - minRadius + margin.top})`)
    .call(g => g.append("circle").attr("cy", bar.width / 2).attr("r", bar.width / 2))
    .call(g => g.append("rect").attr("width", start.left).attr("height", bar.width))
    .call(title)
    .on("mouseover", highlight)
    .on("mouseout", restore);
  if (isDataCurrency.length !== 0) {
    var texts = starts.append("text")
      .attr("class", "start")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "hanging")
      .attr("dx", start.left + start.padding)
      .attr("dy", 4)
      .text(d => `${d[x]} ${d3.format("$.2s")(d.values)}`);
  }
  else {
    var texts = starts.append("text")
      .attr("class", "start")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "hanging")
      .attr("dx", start.left + start.padding)
      .attr("dy", 4)
      .text(d => `${d[x]} ${d3.format(".2s")(d.values)}`);

  }
  var widths = texts.nodes().map(d => d.getComputedTextLength());

  const ext = d3.extent(widths);
  const min = ext[0], max = ext[1];
  starts.append("rect")
    .attr("width", (d, i) => start.right + (max - widths[i]))
    .attr("height", bar.width)
    .attr("transform", (d, i) => `translate(${widths[i] + start.left + start.padding * 2},0)`)

  const startLength = start.left + start.right + start.padding * 2 + max + bar.width + (triangle.num ? 3 : 0);
  starts.append("g")
    .selectAll("polygon")
    .data(seq(triangle.num))
    .join("polygon")
    .attr("points", `0,2 ${triangle.width},${triangle.width} 0,${triangle.height - 2}`)
    .attr("transform", (d, i) => `translate(${startLength - bar.width + i * (triangle.width + triangle.padding)},0)`);

  const y = d => innerRadius(d) - bar.padding / 2 - minRadius + margin.top,
    tspace = startLength + (triangle.width + triangle.padding) * triangle.num;
  g.selectAll("line")
    .data(seq(numOfBars + 1))
    .join("line")
    .attr("stroke", "#ccc")
    .attr("x1", bar.width).attr("y1", y)
    .attr("x2", tspace).attr("y2", y);

  parts.start = starts;

  return tspace;
}

//chart svg
const svg = d3.create("svg")
  .attr("font-size", "10pt")
  .attr("cursor", "default")
  .attr("viewBox", [0, 0, width, height]);

document.body.append(svg.node());

var tspace = 0;
svg.append("g").call(g => tspace = drawStartLines(g));
svg.append("g").call(g => drawRadialBars(g, tspace));


html.appendChild(svg.node());
