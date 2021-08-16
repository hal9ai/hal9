## Getting Started

Here is a quick example that showcases a data pipeline to read a CSV and plot a line chart. Notice that each pipeline step contains a reference to the source to execute and the parameters associated to each step.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/hal9@latest/dist/hal9.js"></script> 
  </head>
  <body>
    <div id="output" style="margin: auto; width: 800px; height: 400px;"></div>
    <script>
      hal9.run([
        hal9.step('import/csv.txt.js', { file: 'https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv' }),
        hal9.step('charts/linechart.txt.js', { x: 'Date', y: [ 'AAPL.Open', 'AAPL.High' ] }, 'output')
      ]);
    </script>
  </body>
</html>
```

![](https://github.com/hal9ai/hal9ai/raw/main/api/examples/csvplot.png)