/**
  output: [console,html]
  params:
    - x
    - y
    - name: chartType
      label: 'Chart Type'
      value:
        - control: 'select'
          value: ''
          values:
            - name: lines
              label: Line
            - name: scatter
              label: Scatter
            - name: barChart
              label: Bar Chart
            - name: fillArea
              label: Fill Area Chart
            - name: histogram
              label: Histogram
            - name: twoHistogram
              label: 2D Histogram

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
  
  console.log('paleta: ' + palette)
  if (x == null){
    throw 'Please select a column for the x-axis'
  }
  if (y == null){
    throw 'Please select a column for the y-axis'
  }
  if (chartType == null){
    throw 'Please select a Chart Type'
  }
    var layout = {
        title: x + ' - ' + y + ' ' + chartType,
        xaxis: {
            title: x,
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: y,
            showline: false
        },
        width: html.offsetWidth,
  
  
    }
  
    //colors
    /*            - schemeTableau10
                - schemeAccent
                - schemeDark2
                - schemePaired
                - schemeSet1
                - schemeSet2
                - schemeSet3
    */
    let dataColor;
    switch (palette) {
        case 'schemeTableau10':
            dataColor = 'rgb(14,101,152)';
            break;
        case 'schemeAccent':
            dataColor = 'rgb(93,202,114)';
            break;
        case 'schemeDark2':
            dataColor = 'rgb(75,160,111)';
            break;
        case 'schemePaired':
            dataColor = 'rgb(168,205,222)';
            break;
        case 'schemeSet1':
            dataColor = 'rgb(230,35,35)';
            break;
        case 'schemeSet2':
            dataColor = 'rgb(123,201,169)';
            break;
        case 'schemeSet3':
            dataColor = 'rgb(123,201,194)';
            break;
    }
    let x_data = data.array(x)
    let texta = [];
    for (i in x_data) {
        texta.push(y);
    }
    let trace, chartData;
    switch (chartType) {
        case 'lines':
            {
                linesTrace = {
                    x: data.array(x),
                    y: data.array(y),
                    mode: 'lines',
                    name: '',
                    hovertemplate:
                        "x_" + x + ': %{x}<br>' +
                        "y_" + y + ': %{y}<br>',
                    line: {
                        color: dataColor,
                        width: dataSizes
                    }
                };
                chartData = [linesTrace];
                break;
            }
  
        case 'scatter':
            {
                scatterTrace = {
                    x: data.array(x),
                    y: data.array(y),
                    mode: 'markers',
                    type: 'scatter',
                    name: '',
                    hovertemplate:
                        "x_" + x + ': %{x}<br>' +
                        "y_" + y + ': %{y}<br>',
                    marker: {
                        size: dataSizes,
                        color: dataColor
                    },
                };
                chartData = [scatterTrace];
                break;
            }
  
        case 'barChart':
            {
                barTrace = {
                    x: data.array(x),
                    y: data.array(y),
                    name: '',
                    type: 'bar',
                    hovertemplate:
                        "x_" + x + ': %{x}<br>' +
                        "y_" + y + ': %{y}<br>',
                    marker: {
                        size: dataSizes,
                        color: dataColor
                    },
                }
                chartData = [barTrace];
                break;
            }
        case 'fillArea':
            {
                fillTrace = {
                    x: data.array(x),
                    y: data.array(y),
                    name: '',
                    type: 'scatter',
                    fill: 'tozeroy',
                    hovertemplate:
                        "x_" + x + ': %{x}<br>' +
                        "y_" + y + ': %{y}<br>',
                    marker: {
                        size: dataSizes,
                        color: dataColor
                    },
                }
                chartData = [fillTrace];
                break;
            }
        case 'histogram':
            {
                fillTrace = {
                    x: data.array(x),
                    name: '',
                    type: 'histogram',
                    hovertemplate:
                        "x_" + x + ': %{x}<br>',
                    marker: {
                        size: dataSizes,
                        color: dataColor
                    },
                }
                chartData = [fillTrace];
                break;
            }
        case 'twoHistogram': {
            twohist = {
                x: data.array(x),
                y: data.array(y),
                name: '',
                type: 'histogram2d',
                hovertemplate:
                    "x_" + x + ': %{x}<br>',
  
            }
            chartData = [twohist];
            break;
        }
  
    }
  
    Plotly.newPlot(html, chartData, layout);
  