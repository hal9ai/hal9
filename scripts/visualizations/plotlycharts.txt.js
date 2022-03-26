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
      label: 'data sizes'
      value: 
        - control: 'number'
          value: 1
    - name: color
      label: 'Color'
      value:
        - control: 'select'
          value: 'red'
          values:
            - name: red
              label: Red
            - name: blue
              label: Blue
            - name: green
              label: Green
            - name: black
              label: Black
            - name: yellow
              label: Yellow
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.plot.ly/plotly-latest.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
**/

data = await hal9.utils.toArquero(data);

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
let dataColor;
switch (color) {
    case 'red':
        dataColor = 'rgb(255,0,0)';
        break;
    case 'blue':
        dataColor = 'rgb(50,55,230)';
        break;
    case 'green':
        dataColor = 'rgb(50,230,70)';
        break;
    case 'black':
        dataColor = 'rgb(0,0,0)';
        break;
    case 'yellow':
        dataColor = 'rgb(230,230,50)';
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
