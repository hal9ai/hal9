/**
  output: [html]
  params:
    - name: x
      label: x
    - name: y
      label: y
  deps: [
    'https://cdn.jsdelivr.net/npm/d3@6',
    'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1',
  ]
  author: analyzer2004
**/

if (y && !Array.isArray(y)) y = [y];
if (!y) y = [];

const totalIdx = data.length - 1;

fmt = n => d3.format(",d")(n)

plotLabel = (data, dy) => 
  Plot.text(data, {
    x: "x",
    y: "accu",
    dy: dy,
    fontWeight: "bold",
    text: d => d3.format(".2s")(d.accu)
  })

let last = 0, accu = 0;  
const waterfall = data.map((d, i) => {
  last = accu;
  accu += d[y];
  return {
    x: d[x],
    nextX: i < totalIdx ? data[i + 1][x] : "Total",
    prior: last,
    accu: accu,
    delta: d[y]
  }    
});

waterfall.push({
  x: "Total",
  nextX: null,
  prior: 0,
  accu: accu,
  delta: 0
});

const chartdata = x && y.length
 ? y.reduce((res, yv, i) => {
     data.forEach(v => {
       res.push({
         x: v.x,
         y: parseFloat(v[yv]),
         z: `y${i}`,
       });
     });
     return res;
   }, [])
 : [];

const colorDomain = ["Increase", "Decrease", "Total"];
const colorRange = ["#649334", "#cc392b", "#1f77b4"];
  
const plot = Plot.plot({
  width: html.clientWidth,
  height: html.clientHeight,
  x: {
    align: 0,    
    round: false,
    domain: waterfall.map(d => d.x)
  },
  y: {
    grid: true,
    nice: true,      
    label: "",      
    tickFormat: d3.format(".2s")
  },
  color: {
    domain: colorDomain,
    range: colorRange
  },
  marks: [   
    Plot.barY(waterfall, {
      x: "x",
      y1: "prior",
      y2: "accu",        
      fill: d => d.x === "Total" ? "Total" : d.delta >= 0 ? "Increase" : "Decrease",
    }),
    Plot.ruleY(waterfall, {
      x1: "x",
      x2: "nextX",
      y: "accu",        
      strokeDasharray: "1.5"
    }),
    Plot.ruleY([0], {strokeDasharray: "1.5"}),
    plotLabel(waterfall.filter(d => d.delta >= 0), "-0.5em"),
    plotLabel(waterfall.filter(d => d.delta < 0), "1.5em")
  ],
  style: {
    background: hal9.isDark() ? "#222" : '',
    color: hal9.isDark() ? "#aaa" : ''
  },
})
  
html.appendChild(plot);
