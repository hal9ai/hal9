/**
  output: [html]
  params: [x, y, value]
  deps: [
    "chart-utils.js",
    "https://cdn.jsdelivr.net/npm/d3@6",
    "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1",
  ]
**/

// calculate counts to get mean value between duplicates
const countsdata = x && y && value
  ? data.reduce((res, v) => {
      const vx = convert(v[x]);
      const vy = convert(v[y]);
      const vv = convert(v[value]);
      const key = `${vx}_${vy}`;

      res[key] = res[key] || { x: vx, y: vy, value: 0, count: 0 };
      res[key].value += vv;
      res[key].count += 1;

      return res;
    }, {})
  : {};

const chartdata = Object.keys(countsdata).map(key => ({
  x: countsdata[key].x,
  y: countsdata[key].y,
  value: isNaN(countsdata[key].value) ? 0 : countsdata[key].value / countsdata[key].count,
}));
const mean = d3.mean(chartdata, d => d.value);

const marks = x && y && value ? [
  Plot.cell(chartdata, { x: "x", y: "y", fill: "value", title: "value" }),
  Plot.text(chartdata, { x: "x", y: "y", text: d => d.value?.toFixed(1), fill: "#222" })
] : [];

html.appendChild(Plot.plot({
  marks,
  color: {
    range: ["white", d3.schemeTableau10[0]],
    interpolate: "hsl",
  },
  grid: true,
  padding: 0.05,
  width: html.clientWidth,
  height: html.clientHeight,
  style: {
    background: hal9.isDark() ? "#222" : "",
    color: hal9.isDark() ? "white" : ""
  },
}));

