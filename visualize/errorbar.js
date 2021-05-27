/**
  output: [html]
  params:
    - name: x
      label: x
    - name: min
      label: Min
    - name: max
      label: Max
    - name: open
      label: Open
    - name: close
      label: Close
    - name: levels
      label: Horizontal levels
  deps: [
    'chart-utils.js',
    'https://cdn.jsdelivr.net/npm/d3@6',
    'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1',
  ]
**/

if (levels && !Array.isArray(levels)) levels = [levels];
if (!levels) levels = [];

const chartdata = x && min && max
  ? data.map(v => {
      const minval = v[min] ? convert(v[min]) : 0;
      const maxval = v[max] ? convert(v[max]) : 0;

      const value = {
        x: convert(v[x]),
        min: minval,
        max: maxval,
        open: open && v[open] ? convert(v[open]) : null,
        close: close && v[close] ? convert(v[close]) : null,
      };

      levels.forEach(l => {
        value[`levels_${l}`] = convert(v[l]);
      });

      return value;
    })
  : [];

const barWidth = Math.max(Math.floor(html.clientWidth / chartdata.length * 0.5), 1);

const marks = [];

if (x && min && max) {
  marks.push(Plot.ruleX(chartdata, { x: "x", y1: "min", y2: "max" }));
}

if (open && close) {
  marks.push(Plot.ruleX(chartdata, {
    x: "x",
    y1: "open",
    y2: "close",
    stroke: d => Math.sign(d.close - d.open),
    strokeWidth: barWidth,
  }));
}

levels.forEach(l => {
  marks.push(Plot.dot(chartdata, {
    x: "x",
    y: `levels_${l}`,
    r: 1,
    fill: "#444",
    stroke: "#444",
  }));
});

html.appendChild(Plot.plot({
  marks,
  x: {
    grid: true,
    inset: 10,
  },
  y: {
    grid: true,
    inset: 10,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  color: {
    range: ["#de7600", "white", "#00b800"],
  },
  width: html.clientWidth,
  height: html.clientHeight,
  style: {
    background: hal9.isDark() ? "#222" : '',
    color: hal9.isDark() ? "white" : ''
  },
}));
