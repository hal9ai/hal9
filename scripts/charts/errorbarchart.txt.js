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
    - name: fontsize
      label: Font Size
      value:
        - control: range
          value: 16
          min: 5
          max: 20
    - name: marginleft
      label: Margin left
      value:
        - control: range
          value: 30
          min: 20
          max: 200
    - name: marginbottom
      label: Margin Bottom
      value:
        - control: range
          value: 30
          min: 20
          max: 200
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
    - https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1
**/

data = await hal9.utils.toRows(data);

if (levels && !Array.isArray(levels)) levels = [levels];
if (!levels) levels = [];

const chartdata = x && min && max
  ? data.map(v => {
      const minval = v[min] ? hal9.utils.convert(v[min]) : 0;
      const maxval = v[max] ? hal9.utils.convert(v[max]) : 0;

      const value = {
        x: hal9.utils.convert(v[x]),
        min: minval,
        max: maxval,
        open: open && v[open] ? hal9.utils.convert(v[open]) : null,
        close: close && v[close] ? hal9.utils.convert(v[close]) : null,
      };

      levels.forEach(l => {
        value[`levels_${l}`] = hal9.utils.convert(v[l]);
      });

      return value;
    })
  : [];

const barWidth = Math.max(Math.floor(html.clientWidth / chartdata.length * 0.5), 1);

const marks = [];

const getTitle = d => {
  const title = d.x.toLocaleString() +
    `\nMin: ${d.min}\nMax: ${d.max}` +
    (d.open ? `\nOpen: ${d.open}` : '') +
    (d.close ? `\nClose: ${d.close}` : '');

  return title;
};

if (x && min && max) {
  marks.push(Plot.ruleX(chartdata, {
    x: 'x',
    y1: 'min',
    y2: 'max',
    title: d => getTitle(d),
  }));
}

if (open && close) {
  marks.push(Plot.ruleX(chartdata, {
    x: 'x',
    y1: 'open',
    y2: 'close',
    stroke: d => Math.sign(d.close - d.open),
    strokeWidth: barWidth,
    title: d => getTitle(d),
  }));
}

levels.forEach(l => {
  marks.push(Plot.dot(chartdata, {
    x: 'x',
    y: `levels_${l}`,
    r: 1,
    fill: '#444',
    stroke: '#444',
    title: d => `${l}: ${d[`levels_${l}`.toLocaleString()]}`,
  }));
});

const colors = ['#de7600', 'white', '#00b800'];
const plot = Plot.plot({
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
    range: colors,
  },
  width: html.clientWidth,
  height: html.clientHeight,
  marginLeft: parseInt(marginleft),
  marginBottom: parseInt(marginbottom),
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
    fontSize: parseInt(fontsize),
  },
})

html.appendChild(plot);
