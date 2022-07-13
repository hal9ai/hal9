/**
  output: [console,html]
  description: Group the rows of a dataframe to create univariate histograms to visualize the distribution of the dataset
  params:
    - name: x
      label: x
      static: false
      description: The name of the column in the input dataframe that who's distribution to be visualized
    - name: histfunc
      label: 'Aggregation Function'
      description: The function used to aggregate the values collected in each bin for summarization.
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
    - name: histnorm
      label: Normalization
      description: The aggregation method to apply on outputs of the aggregation functions.
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
            - name: probability
              label: Probability
            - name: density
              label: Density
    - name: barmode
      label: Bar Mode
      description: One of stacked or overlaid, which controls the manner in which multiple distributions selected in x are visualized.
      value:
        - control: select
          value: stack
          values:
            - name: stack
              label: Stacked
            - name: overlay
              label: Overlaid
    - name: palette
      label: Chart Palette
      description: The D3 palette used to control the colors of each of the distributions in x.
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
    - https://cdn.jsdelivr.net/npm/d3@6
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
console.log(d3[palette])
for (i=0; i<x.length; i++) {
var trace = {
  x: data.array(x[i]),
  type: "histogram",
  histnorm: histnorm,
  histfunc: histfunc,
  name: x[i],
  marker: {
     color: d3[palette][i],
  }
};
if (barmode === 'overlay' && x.length > 1) {
  trace['opacity'] = 0.6
}
chartdata.push(trace)
}
Plotly.newPlot(html, chartdata, layout, {displaylogo: false});
