/**
  output: [ html ]
  params:
    - name: label
      label: Label
    - name: size
      label: Size
  deps: [ 'd3.v6.min.js', 'chart.js', 'grid-chart.js', 'xy-chart.js', 'treemap-chart.js', 'chart-utils.js' ]
**/

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const grouped = groupBy(data, label);
 
const chartData = {
  name: 'root',
  children: [],
};

chartData.children = Object.keys(grouped).map(group => {
  return {
    name: group,
    children: grouped[group].map(g => {
      return { name: g[label] ? g[label] : g[size], value: g[size] };
    })
  }
});

const chart = new TreemapChart(chartData);
chart.appendTo(wrapper(html));
