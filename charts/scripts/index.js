document.addEventListener('DOMContentLoaded', () => {
  const $container = document.querySelector('main');

  const N = 100;
  const sizeRange = [5, 10];

  // LINE, BUBBLE
  const data = [];

  for (let i = 0; i < N; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    data.push({
      x: date,
      values: [
        {
          key: 'l1',
          value: (Math.random() > 0.5 ? -1 : 1) * Math.round(Math.random() * N),
          size: Math.random(),
          color: Math.random() * 10,
        },
        {
          key: 'l2',
          value: (Math.random() > 0.5 ? -1 : 1) * Math.round(Math.random() * N),
          size: Math.random(),
          color: Math.random() * 10,
        },
      ],
    });
  }

  const $lineChart = $container.querySelector('.d3-line-chart');
  const lineChart = new LineChart(data, { y: 'values' });
  lineChart.appendTo($lineChart);

  const $bubbleChart = $container.querySelector('.d3-bubble-chart');
  const bubbleChart = new BubbleChart(data, { y: 'values', size: 'size', color: 'color' });
  bubbleChart.appendTo($bubbleChart);

  // HISTOGRAM
  const histogramData = [];

  for (let i = 0; i < N; i++) {
    histogramData.push({
      x: i,
      y: (Math.random() > 0.5 ? -1 : 1) * Math.round(Math.random() * N),
    });
  }

  const $histogramChart = $container.querySelector('.d3-histogram-chart');
  const histogramChart = new HistogramChart(histogramData, { thresholds: 20 });
  histogramChart.appendTo($histogramChart);

  // BARS
  const barsData = [];
  const barsCount = 3;

  for (let i = 0; i < N / 5; i++) {
    const values = [];
    for (var j = 0; j < barsCount; j++) {
      values.push({ key: j, value: Math.round(Math.random() * N) });
    }
    barsData.push({ x: i, values });
  }

  const $barChart = $container.querySelector('.d3-bar-chart');
  const barChart = new BarChart(barsData, { y: 'values' });
  barChart.appendTo($barChart);

  document.querySelector('.update-bar-type').addEventListener('click', () => {
    barChart.setParameter('stacked', !barChart.params.stacked);
  });

  // ERROR BARS
  const errorsData = [];

  for (let i = 0; i < N / 4; i++) {
    errorsData.push({
      x: i,
      y: [ i - 2 /* min */, i + 2 /* max */, i - 1 /* boxmin */, i + 1 /* boxmax */, [ i - 2, i + 2, i ] /* points */ ],
      color: Math.random()
    });
  }
  const $errorBarChart = $container.querySelector('.d3-error-bar-chart');
  const errorBarChart = new ErrorBarChart(errorsData, { padding: 0.2, color: 'color', palette: ['white', 'red'] });
  errorBarChart.appendTo($errorBarChart);

  // TREEMAP
  const treemapData = {
    name: 'root',
    children: [],
  };

  for (let i = 0; i < 5; i++) {
    const children = [];

    for (let j = 0; j < Math.round(Math.random() * 5); j++) {
      children.push({
        name: `child_${i + 1}_${j + 1}`,
        value: Math.round(Math.random() * N),
      })
    }
    treemapData.children.push({
      name: `child_${i + 1}`,
      children,
    });
  }

  const $treemapChart = $container.querySelector('.d3-treemap-chart');
  const treemapChart = new TreemapChart(treemapData);
  treemapChart.appendTo($treemapChart);

  // HEATMAP
  const heatmapData = {};

  for (let i = 0; i < N / 5; i++) {
    const values = {};

    for (let j = 0; j < N / 5; j++) {
      values[j] = Math.round(Math.random() * N);
    }
    heatmapData[i] = values;
  }

  const $heatmapChart = $container.querySelector('.d3-heatmap-chart');
  const heatmapChart = new HeatmapChart(heatmapData, { palette: ['yellow', 'red'] });
  heatmapChart.appendTo($heatmapChart);

  // SANKEY
  const sankeyData1 = {
    nodes: [],
    links: [],
  };
  const nodesCount = 10;

  for (let i = 0; i < nodesCount; i++) {
    sankeyData1.nodes.push({ id: i, name: `n${i}` });

    const target = Math.round(i + 1 + Math.random() * (nodesCount - i - 2));

    if (target < nodesCount && target !== i) {
      sankeyData1.links.push({
        source: i,
        target,
        value: 2 + Math.round(Math.random() * (nodesCount - 2)),
      });
    }
  }

  const $sankeyChart = $container.querySelector('.d3-sankey-chart');
  const sankeyChart = new SankeyChart(sankeyData1);
  sankeyChart.appendTo($sankeyChart);
});
