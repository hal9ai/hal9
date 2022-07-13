/**
  output: [ html ]
  description: create subplots on a shared set of axes to visualize how distributions vary accross different categories
  params:
    - name: x
      label: x
      single: true
      description: The column in the dataframe that should be along the x-axis in all the subplots.
    - name: 'y'
      label: 'y'
      single: true
      description: The column in the dataframe that should be along the y-axis in all the subplots.
    - name: facets
      label: Facets
      description: The columns in the dataframe that should define the marks to facetted subplots in  horizontal and vertical directions of the subplots.
    - name: color
      label: Color
      description: The column in the dataframe that will define the color of the marks in each of the subplots.
    - name: chartType
      label: Chart
      description: The type of chart each of the subplots. Currently supports Scatter, Bar, Line and Cell
      value:
        - control: select
          value: dot
          values:
            - name: dot
              label: Scatter
            - name: barY
              label: Bars
            - name: line
              label: Line
            - name: cell
              label: Cell
    - name: palette
      label: D3 Palette
      description: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.

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
    - https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1
**/

data = await hal9.utils.toRows(data);

if (data == null) {
  throw 'No input data defined. Please use an import block to import data before visualizing it.'
}

if (data.length > 10000) {
  throw(`Up to 10,000 data points are supported for this visualization, but ${data.length} were provided.`);
}

if (x == null){
  throw 'Please select a column for the x-axis'
}
if (y == null){
  throw 'Please select a column for the y-axis'
}

if (!facets) facets = [];
if (!Array.isArray(facets)) facets = [ facets ];

var plotScheme = palette.replace('scheme','');
let colorDefault = d3.scaleOrdinal(d3[palette])
    .domain([1])()

var plot = Plot.plot({
  grid: true,
  facet: {
    data: data,
    x: facets[0],
    y: facets.length > 1 ? facets[1] : undefined,
    marginRight: 80
  },
  marks: [
    Plot.frame(),
    Plot[chartType](data, {
      x: x,
      y: y,
      fill: color ? color : colorDefault,
    })
  ],
  color: {
    scheme: color ? plotScheme : undefined,
  },
  width: html.clientWidth,
  height: html.clientHeight,
  style: {
    background: hal9.isDark() ? '#222' : '',
    color: hal9.isDark() ? 'white' : '',
  },
})

html.appendChild(plot);
