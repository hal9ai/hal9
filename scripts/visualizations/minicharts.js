/**
  output: [html]
  params:
    - name: charts
      label: Charts to use
      value: 
        - control: 'number'
    - x
    - y
    - name: palette
      label: D3 Palette
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
    - https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css
**/

data = await hal9.utils.toRows(data);

if (data.length > 10000) {
    throw (`Up to 10,000 data points are supported for this visualization, but ${data.length} were provided.`);
}

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



const margin = { top: 10, right: 10, bottom: 0, left: 10 },
    width = 65 - margin.left - margin.right,
    height = 25 - margin.top - margin.bottom;

function d3creation(chartData, name, x, y) {
    //First table D3
    var xLabel = d3.scaleLinear()
        .domain(d3.extent(chartData, function (d) { return d[x]; }))
        .range([0, width]);

    var yLabel = d3.scaleLinear()
        .domain(d3.extent(chartData, function (d) { return d[y]; }))
        .range([height, 0]);

    //data together to draw
    var slice = d3.line()
        .x(function (d) { return xLabel(d[x]); })
        .y(function (d) { return yLabel(d[y]); })


    var svg = d3.select("#" + name)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("path")
        .attr("class", "line")
        .attr("d", slice(chartData))
        .style("fill", "none")
        .style("stroke", dataColor)
        .style("stroke-width", 0.7);

}

let keys = Object.keys(data[0])

if (html) {

    //main container 
    var table = document.createElement('table');

    //row container
    //headers
    let tr = document.createElement('tr');

    //Headers name  
    let td1 = document.createElement('th');
    td1.innerText = "Name"
    td1.width = 100

    let td2 = document.createElement('th');
    td2.innerText = keys[1]
    td2.width = 100

    let td3 = document.createElement('th');
    td3.innerText = keys[2]
    td3.width = 100

    let td4 = document.createElement('th');
    td4.innerText = 'Sparkline'

    //Append to the html-----
    //main container
    html.appendChild(table)
    //Headers
    table.appendChild(tr)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
}

var columnCounter = 0;
var rowCounter1 = 0;
var rowCounter2 = 0;
var rowCounter3 = 0;
var rowCounter4 = 0;
var counterviz = 0;

for (let i = 0; i < charts; i++) {
    try {
        //row container
        let newTr = document.createElement("tr");
        newTr.id = 'column' + (++columnCounter);
        //row data
        let newTd = document.createElement('th');
        newTd.id = 'row1' + (++rowCounter1);
        newTd.innerText = data[i]['stock'];
        let newTd2 = document.createElement('th');
        newTd2.innerText = data[i][x][0] + '... ' + data[i][x][data[i][x].length - 1];
        newTd2.id = 'row2' + (++rowCounter2);

        let newTd3 = document.createElement('th');
        newTd3.innerText = data[i][y][0] + '... ' + data[i][y][data[i][y].length - 1];
        newTd3.id = 'row3' + (++rowCounter3);

        let newTd4 = document.createElement('th');
        newTd4.id = 'row4' + (++rowCounter4);


        let viz = document.createElement('div');
        viz.id = 'viz' + (++counterviz);

        table.appendChild(newTr)
        newTr.appendChild(newTd)
        newTr.appendChild(newTd2)
        newTr.appendChild(newTd3)
        newTr.appendChild(newTd4)
        newTd4.appendChild(viz)
        let chartData = [];

        for (let j = 0; j < data[i][x].length; j++) {
            let obj = {}
            let xkey = x;
            let ykey = y;
            obj[xkey] = data[i][x][j];
            obj[ykey] = data[i][y][j];
            chartData.push(obj);
        }

        if (typeof (chartData[1][y]) == "number") {
            d3creation(chartData, 'viz' + counterviz, x, y)
        }

    }
    catch {
        throw (`The data frame length is ${data.length} and you requested ${charts}`);
    }
}

