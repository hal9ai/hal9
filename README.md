
# Hal9

Hal9 provides a platform to develop Artificial Intelligence solutions with web technologies. This repo contains the open source components that power [hal9.ai](https://hal9.ai) which consist of:

- A `hal9.js` library which allows you to compose pipelines with very little code.
- A library of blocks available under `/scripts` which can easily reused in pipelines.

## Getting Started

Here is a quick example that showcases a data pipeline which reads a CSV and plots a line chart. Notice that each pipeline step contains a reference to the source to execute and the parameters associated to each step.

```
<!DOCTYPE html>
<html>
  <head>
    <script src="hal9.js"></script> 
  </head>
  <body>
    <div id="output"></div>
    <script>
      hal9.run([
        hal9.step('import/csv.js', { file: 'https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv' }),
        hal9.step('visualize/linechart.js', { x: 'Date', y: [ 'AAPL.Open', 'AAPL.High' ] })
      ], 'output');
    </script>
  </body>
</html>
```

![](api/examples/csvplot.png);

Please also join our **Slack** group to help you get started. To join our Slack group, request access by sending us an email to `info@hal9.ai`.

Feel free to use our development environment [devel.hal9.ai](https://devel.hal9.ai); however, this environment produces daily builds and is not recommended for production use..

## Concepts

This repo contains everything related to the hal9 project, an application and service to make Artificial Intelligence more accessible. Not just the technical components, but also the website, pricing and even plans for future equity distribution.

The concepts behind this project are the following:
- **Pipeline:** A pipeline is a set of arbitrary operations executed sequentially.
- **Step:** A step is just a step to be executed in the pipeline.
- **Script:** A script is the code behind a pipeline's step. It's currently written in JavaScript but this could be extended in the future.
- **Header:** Each script has a YAML header that describes the script. It contains the input, output, parameters, environment, caching strategy, etc. that the script requires.
- **Parameters:** The parameters describes what values are passed to each script, think of them as function parameters to each script.

As you can see, there is nothing particular to Artificial Intelligence in those concepts. However, we will provide pipelines steps for others to build AI applications that loosely follow these stages:
- **Import:** Data is imported from a given location.
- **Transform:** Data is cleaned and transformed into a usable state.
- **Visualize:** Data is then rendered to find insights using a library of multiple scripts that support many charts.
- **Train:** Data is then used to create a predictive model.
- **Predict:** Data is then used for prediction or classification.
- **Explain:** The prediction can then be explained to gain further insights.
- **Export:** Elements of this workflow are then exported to 3rd parties.

Notice that most stages are optional, some users might want to just "Import and Visualize" data, or "Import and Predict using pre-trained models"; while others might want to make use of every step. In addition, the platform does not really know, nor care, that the scripts being run create an AI workflow.

This code repository is structured as follows:
- **API:** The [api](api/) path builds the public JavaScript API which developers can use to access our backend.
- **Core:** The [core](core) path contains code that is shared by the application and workers. Currently provides support to parse and execute scripts.
- **Scripts:** The [scripts](scripts/) path contains scripts used in the application pipeline.