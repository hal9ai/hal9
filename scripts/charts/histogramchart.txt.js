/**
  output: [console,html]
  params:
    - x
    - name: histnorm
      label: Normalization
      value:
        - control: select
          value: none
          values:
            - name: 'probability density'
              label: 'Probability Density'
            - name: percent
              label: Percentage
            - name: 'none'
              label: 'None'
            - name: percent
              label: Percent
            - name: probability
              label: Probability
            - name: density
              label: Density
    - name: histfunc
      label: 'Aggregation Function'
      value:
        - control: select
          value: count
          values:
            - name: 'count'
              label: 'Count'
            - name: min
              label: Minimum
            - name: max
              label: Maximum
            - name: sum
              label: Sum
            - name: probability
              label: Probability
            - name: density
              label: Density
    - name: barmode
      label: Bar Mode
      value:
        - control: select
          value: stacked
          values:
            - name: stack
              label: Stacked
            - name: overlay
              label: Overlaid
    - name: dataSizes
      label: 'Marker Size'
      value: 
        - control: 'number'
          value: 5
    - name: dataSizes
      label: 'Marker Size'
      value: 
        - control: 'number'
          value: 5
    - name: palette
      label: Chart Palette
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
    - https://cdn.plot.ly/plotly-latest.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
**/

if (data == null) {
  throw 'No input data defined. Please use an import block to import data before visualizing it.'
}
data = await hal9.utils.toArquero(data);
if (x == null){
throw 'Please select a column for the x-axis'
}
var layout = {
title: x + ' Histogram',
xaxis: {
  title: x,
  showgrid: false,
  zeroline: false
},
yaxis: {
          showline: false
},
width: html.offsetWidth,
barmode: barmode
}
if (histnorm == 'none'){
layout['yaxis']['title'] = histfunc
} else {
layout['yaxis']['title'] = histnorm
}
x = x.constructor === Array ? x : [x];
chartdata = [];
for (i=0; i<x.length; i++) {
var trace = {
  x: data.array(x[i]),
  type: "histogram",
  histnorm: histnorm,
  histfunc: histfunc,
  name: x[i],
  color: palette[i]
};
if (barmode === 'overlay' && x.length > 1) {
  trace['opacity'] = 0.6
}
chartdata.push(trace)
}
Plotly.newPlot(html, chartdata, layout, {displaylogo: false});