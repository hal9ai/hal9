import hal9

def encode(data):
  import json

  if (type(data).__name__ == "DataFrame"):
    return data.to_json(orient = 'records')
  else:
    return json.dumps(data)

def add_id_to_list(iterable):
    
    id = 0
    for element in iterable:
        element["id"] = id
        id = id+1
    return(iterable)

class h9:
  """hal9 pipeline class"""

  def __init__(self):
    self.params = {}
    self.outputs = {}
    self.steps = []
    self.html_code = ""
    self.last_step_id = 0

  def add_step(self, step_name, **kwargs):
    """Adds a generic step to a pipeline instance.

    This is 

    >>> pipeline = h9.create()
    >>> pipeline.add_step("load")
    >>> pipeline.show()

    """
    import pkg_resources

    new_id = self.last_step_id+1

    json_metadata = open(pkg_resources.resource_filename('hal9', 'data/'+step_name+'.js'))
    component = json.load(json_metadata)

    new_step = {k: component.get(k, None) for k in ('name', 'label', 'language', 'description', 'icon')}
    new_step["params"] = {}
    new_step["id"] = new_id

    self.steps.append(new_step)

    step_param_list = component["params"]
    param_names = [param["name"] for param in step_param_list]

    param_dict = dict(zip(param_names, step_param_list))

    for parameter_name, parameter_value in kwargs.items():
      standard_value = param_dict[parameter_name]["value"]

      if ~("static" in param_dict[parameter_name].keys()):
        param_dict[parameter_name]["static"] = True

      if isinstance(standard_value, list):  
        standard_value = add_id_to_list(standard_value)

        id_value = 0
        for element in standard_value:
          element["id"] = id_value
          id_value = id_value + 1

          if element["control"] == "dataframe":
            element["value"] = encode(parameter_value).replace("\"", "")
          else:
            element["value"] = parameter_value
      else:
        if param_dict[parameter_name]["static"]:
            element["value"] = parameter_value
        else:
            element["value"] = [{"name": parameter_value}]
    
    self.params[new_id] = param_dict

    return(self)

  def show2(self, height = 400, **kwargs):
      
    from IPython.display import display, HTML
    
    a = 1

    html_code = """
      <script src = "https://cdn.jsdelivr.net/npm/hal9@0.2.78/dist/hal9.min.js">
      <div style='width: 100%; padding: 6px; height: 400px'>
        <div id='app'>
        </div>
      </div>
      <script>
        const css = `
          #output {
            display: flex;
            flex-direction: column;
          }`;

        const pipeline_json = {
          "steps": [{"name": "dataframe", "label": "DataFrame", "language": "javascript", "description": "Loads a dataframe", "icon": "fa-light fa-columns-3", "params": {}, "id": 1}],
          "params": {"1": {"dataset": {"name": "dataset", "label": "Dataset", "description": "The dataframe to load", "value": [{"control": "dataframe", "id": 0, "value": [{cyl:1,mpg:2},{cyl:2,mpg:3 }] }], "static": true}}},
          "outputs": {},
          "scripts": [],
          "version": "0.0.1"
        }

        hal9.init({
          iframe: true,
          html: document.getElementById('app'),
          api: "https://cdn.jsdelivr.net/npm/hal9@0.2.78/dist/hal9.min.js",
          css: css,
          editable: true,
          mode: "run",
          pipeline: pipeline_json
        }, {}).then(function(hal9) {
          if (hal9) {
            hal9.load(pipeline_json).then(function(pid) {
              hal9.run(pid, { html: 'output', shadow: false });
            });
          }
        });
      </script>"""

    self.html_code = html_code

  def show(self, height = 400, **kwargs):

    from IPython.display import display, HTML

    """Renders the pipeline content on a notebook.

    This functions produces a HTML display block rendering the pipeline content.

    >>> pipeline = h9.create()
    >>> pipeline.add_step("load")
    >>> pipeline.show()

    """
    display(HTML("""<div id="app"></div><script>        const css = `
          #output {
            display: flex;
            flex-direction: column;
          }`;

        const pipeline_json = {
        "steps": """ + encode(self.steps) + """",
        "params": """ + encode(self.params) + """",
        "outputs": """ + encode(self.outputs) + """",
        scripts": { "1": "data = window.hal9.data" },
        "version": "0.0.1"
      }

        hal9.init({
          iframe: true,
          html: document.getElementById('app'),
          api: "https://cdn.jsdelivr.net/npm/hal9@0.2.78/dist/hal9.min.js",
          css: css,
          editable: true,
          mode: "run",
          pipeline: pipeline_json
        }, {}).then(function(hal9) {
          if (hal9) {
            hal9.load(pipeline_json).then(function(pid) {
              hal9.run(pid, { html: 'output', shadow: false });
            });
          }
        });
      </script>"""))

  def old_show(self, height = 400, **kwargs):
    """Renders the pipeline content on a notebook.

    This functions produces a HTML display block rendering the pipeline content.

    >>> pipeline = h9.create()
    >>> pipeline.add_step("load")
    >>> pipeline.show()

    """

    from IPython.display import display, HTML

    display(HTML("""<script>
    window.hal9 = {
      data: "",
      pipeline: {
        "steps": """ + encode(self.steps) + """",
        "params": """ + encode(self.params) + """",
        "outputs": """ + encode(self.outputs) + """",
        scripts": { "1": "data = window.hal9.data" },
        "version": "0.0.1"
      }
    }
    </script>
    <script defer src="https://hal9.com/hal9.notebook.js"></script>
    <div style='width: 100%; padding: 6px; height: """ + str(height) + "px'><div id='app'></div></div>"
    ))

  def assign(self , column, array):
    """Attach a new column

      :param str column: Name of the new column
      :param str array: The array to be added to the table

    """
    self.add_step("assign" , column, array)
    return(self)


  def bar_chart(self , x, y, type, orientation, palette, fontsize, tickrotation, marginleft, marginbottom):
    """Our first chart type needs no introduction

      :param str x: The variable that horizontal axis
      :param str y: The variable that should be on the vertical axis.
      :param str type: One of 'grouped' or 'stacked'. In grouped mode, bars are placed next to each other, in stacked mode bars are placed above each other.
      :param str orientation: 
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
      :param str fontsize: Size of the font to be used in the x and y axes.
      :param str tickrotation: The angle at which to place the x-axis labels
      :param str marginleft: the left margin
      :param str marginbottom: the bottom margin

    """
    self.add_step("bar_chart" , x, y, type, orientation, palette, fontsize, tickrotation, marginleft, marginbottom)
    return(self)


  def bubble_chart(self , label, size, palette):
    """Bigger values -> bigger bubbles

      :param str label: The column in the dataframe who's values should be used as labels on the circles
      :param str size: The column in the dataframe who's values should the area of each circle be propotional to.
      :param str palette: the D3 Palette to determine the color scheme to use

    """
    self.add_step("bubble_chart" , label, size, palette)
    return(self)


  def convert(self , field, dataType, timeConverter, charactersToRemove):
    """Apply an expression to the values in a specific column

      :param str field: The name of the column to convert
      :param str dataType: The target data type
      :param str timeConverter: an optional parameter to help convert date-times
      :param str charactersToRemove: a string of characters to remove

    """
    self.add_step("convert" , field, dataType, timeConverter, charactersToRemove)
    return(self)


  def derive(self , column, expression):
    """Create a new column or replace an existing one via an expression

      :param str column: The name of the new column. If this is a column that already exists in the dataframe, the derived column replaces the exisiting one.
      :param str expression: The expression based on which the new columns are derived

    """
    self.add_step("derive" , column, expression)
    return(self)


  def dot_chart(self , x, color, palette, dotsize, ticks, fontsize, marginleft, marginbottom):
    """Stack data into columns of dots

      :param str x: The column in the dataframe whose values should determine the position of the dots along the x-axis
      :param str color: The column in the dataframe who's values should determine the color of each dot
      :param str palette: the D3 Palette to determine the color scheme to use
      :param str dotsize: the size of each dot
      :param str ticks: The number of ticks on the x-axis
      :param str fontsize: the size of the font in pixels
      :param str marginleft: the left margin
      :param str marginbottom: the bottom margin

    """
    self.add_step("dot_chart" , x, color, palette, dotsize, ticks, fontsize, marginleft, marginbottom)
    return(self)


  def drop(self , columns):
    """Remove specific columns

      :param str columns: The list of columns to remove

    """
    self.add_step("drop" , columns)
    return(self)


  def error_chart(self , x, min, max, open, close, levels, fontsize, marginleft, marginbottom):
    """Explain financial trends with a candlestick chart

      :param str x: the column in the dataframe that is the contains the values for the x coordinates
      :param str min: the column in the dataframe that is the contains the values for the minimum at each x coordinate
      :param str max: the column in the dataframe that is the contains the values for the maximum at each x coordinate
      :param str open: the column in the dataframe the contains the values at opening at each x coordinate
      :param str close: the column in the dataframe the contains the values at close m at each x coordinate
      :param str levels: 
      :param str fontsize: the font size
      :param str marginleft: The left margin
      :param str marginbottom: the bottom margin

    """
    self.add_step("error_chart" , x, min, max, open, close, levels, fontsize, marginleft, marginbottom)
    return(self)


  def facets_chart(self , x, y, facets, color, chartType, palette):
    """A chart of charts organized in a grid

      :param str x: The column in the dataframe that should be along the x-axis in all the subplots.
      :param str y: The column in the dataframe that should be along the y-axis in all the subplots.
      :param str facets: The columns in the dataframe that should define the marks to facetted subplots in  horizontal and vertical directions of the subplots.
      :param str color: The column in the dataframe that will define the color of the marks in each of the subplots.
      :param str chartType: The type of chart each of the subplots. Currently supports Scatter, Bar, Line and Cell
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.

    """
    self.add_step("facets_chart" , x, y, facets, color, chartType, palette)
    return(self)


  def filter(self , field, expression):
    """Keep only the rows that satisfy a given expression for a specific column

      :param str field: The column on which to filter
      :param str expression: the criteria on which to filter the rows

    """
    self.add_step("filter" , field, expression)
    return(self)


  def fold(self , gather):
    """Fold one or more columns into a pair of key-value columns

      :param str gather: the list of columns to convert into key-value pairs

    """
    self.add_step("fold" , gather)
    return(self)


  def funnel_chart(self , stage, value, label, fontSize, showPercentSelection, funnelType, palette):
    """Communicate how data narrows down

      :param str stage: The column in the dataframe that contains all the stages of the process
      :param str value: The column in the dataframe that contains the values corresponding to each stage of the process
      :param str label: The column in the dataframe that should be used to create labels of the stages
      :param str fontSize: The font size
      :param str showPercentSelection: Boolean on whether to show the percentage in each step
      :param str funnelType: The type of the funnel to make. Options are 2d, 3d and flat.
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.

    """
    self.add_step("funnel_chart" , stage, value, label, fontSize, showPercentSelection, funnelType, palette)
    return(self)


  def heatmap_chart(self , x, y, value, palette, fontsize, marginleft, marginbottom):
    """Draw attention to larger values with more vibrant colors in this 2D map

      :param str x: The column in the dataframe that defines the x coordinates of the marks
      :param str y: The column in the dataframe that defines the y coordinates of the marks
      :param str value: The column in the dataframe that defines the intensity of the colors of the marks
      :param str palette: 
      :param str fontsize: The font size
      :param str marginleft: The left margin
      :param str marginbottom: The bottom margin

    """
    self.add_step("heatmap_chart" , x, y, value, palette, fontsize, marginleft, marginbottom)
    return(self)


  def histogram_chart(self , x, histfunc, histnorm, barmode, palette):
    """Show further granularity within buckets via optional color palettes

      :param str x: The name of the column in the input dataframe that who's distribution to be visualized
      :param str histfunc: The function used to aggregate the values collected in each bin for summarization.
      :param str histnorm: The aggregation method to apply on outputs of the aggregation functions.
      :param str barmode: One of stacked or overlaid, which controls the manner in which multiple distributions selected in x are visualized.
      :param str palette: The D3 palette used to control the colors of each of the distributions in x.

    """
    self.add_step("histogram_chart" , x, histfunc, histnorm, barmode, palette)
    return(self)


  def impute(self , field, method):
    """Fill in a column's missing data with the value of an aggregation

      :param str field: List of columns in which to replace missing values
      :param str method: the function to use to impute the missing values. Currently available options are 'max', 'min', 'mean' median', 'zero'. Default is 'zero'

    """
    self.add_step("impute" , field, method)
    return(self)


  def line_chart(self , x, y, palette, domainx, fontsize, marginleft, marginbottom):
    """For use with sorted X axis values only...unless you like scribbles

      :param str x: The column in the dataframe which defines the x coordinate of each vertex of the line
      :param str y: The column in the dataframe which defines the y coordinate of each vertex of the line
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
      :param str domainx: 
      :param str fontsize: 
      :param str marginleft: 
      :param str marginbottom: 

    """
    self.add_step("line_chart" , x, y, palette, domainx, fontsize, marginleft, marginbottom)
    return(self)


  def load(self , dataset):
    """Loads a dataframe

      :param str dataset: The dataframe to load

    """
    self.add_step("load" , dataset)
    return(self)


  def map_chart(self , lon, lat, size, label):
    """Clearly map out Earthly datasets that have columns for latitude and longitude

      :param str lon: The column that contains the values that should be interpreted as the Longitude of vertex
      :param str lat: The column that contains the values that should be interpreted as the Longitude of vertex
      :param str size: The column propotional to which the points size should be.
      :param str label: The column which contains the labels of each of the verticies.

    """
    self.add_step("map_chart" , lon, lat, size, label)
    return(self)


  def network_chart(self,f_from, to):
    """Dazzle your colleagues with this colorful animated network graph

      :param str from: Column containing the origin vertices of all the edges in the graph
      :param str to: Column containing the target vertices of all the edges in the graph

    """
    self.add_step("network_chart" ,f_from, to)
    return(self)


  def pivot(self , rows, columns, values, summarizer):
    """Pivot columns into a cross-tabulation

      :param str rows: The column whose unique values should serve as the rows of the new dataframe
      :param str columns: The column whose unique values should serve as the columns of the new dataframe
      :param str values: The columns whose values should be collected to serve as the individual cells of the table
      :param str summarizer: the method to aggregate the collected values

    """
    self.add_step("pivot" , rows, columns, values, summarizer)
    return(self)


  def plotly_chart(self , x, y, chartType, dataSizes, palette):
    """Choose from a variety of Plotly visualizations

      :param str x: The column that determines the x coordinates in the cartesian plane of the marks
      :param str y: The column that determines the y coordinates in the cartesian plane of the marks
      :param str chartType: The chart to be constructed. Currently accepts one of lines, scatter, barChart, fillArea, histogram, twoHistogram
      :param str dataSizes: The size of the marks
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.

    """
    self.add_step("plotly_chart" , x, y, chartType, dataSizes, palette)
    return(self)


  def radial_chart(self , x, y, wafflesizelabel, palette):
    """A circular bar chart

      :param str x: The column containing the labels of the charts
      :param str y: the column containing the values the areas they occupy in the rectagular area should be propotional to
      :param str wafflesizelabel: The size of the large rectangle
      :param str palette: the D3 Palette to determine the color scheme to use

    """
    self.add_step("radial_chart" , x, y, wafflesizelabel, palette)
    return(self)


  def read_csv(self , file, separator, skip):
    """Import a CSV formatted dataset

      :param str file: Either the URL for the csv or a local file.
      :param str separator: A single-character delimiter string between column values (default ',')
      :param str skip: The number of lines to skip (default 0) before reading data

    """
    self.add_step("read_csv" , file, separator, skip)
    return(self)


  def read_excel(self , file):
    """Import a dataset from a sheet of an Excel file

      :param str file: 

    """
    self.add_step("read_excel" , file)
    return(self)


  def read_json(self , file, extract):
    """Import a JSON formatted dataset

      :param str file: 
      :param str extract: 

    """
    self.add_step("read_json" , file, extract)
    return(self)


  def read_sqlite(self , file, query):
    """Query data from a SQLite database

      :param str file: 
      :param str query: 

    """
    self.add_step("read_sqlite" , file, query)
    return(self)


  def regression_chart(self , x, y, type, predictions):
    """Fit a regression model to a dataset to predict future values

      :param str x: 
      :param str y: 
      :param str type: 
      :param str predictions: 

    """
    self.add_step("regression_chart" , x, y, type, predictions)
    return(self)


  def roll_sum(self , column):
    """Create new columns from the running totals of others

      :param str column: The column for which to calculate the rolling sum.

    """
    self.add_step("roll_sum" , column)
    return(self)


  def sample(self , samplesize, withReplacement):
    """Trim a dataset down to a random sample of its rows

      :param str samplesize: The size of the sample as a percentage of the size of the input dataframe
      :param str withReplacement: Allow or disallow sampling of the same row more than once. Default- True

    """
    self.add_step("sample" , samplesize, withReplacement)
    return(self)


  def sankey_chart(self , source, target, value, palette, fontsize, marginleft, marginbottom):
    """Show the flow with Captain Sankey's signature diagram

      :param str source: The column containing the source nodes
      :param str target: The column containing the target nodes
      :param str value: The column containing the volume of each arrow
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
      :param str fontsize: The font size in pixels
      :param str marginleft: The margin on the left
      :param str marginbottom: The margin on the bottom

    """
    self.add_step("sankey_chart" , source, target, value, palette, fontsize, marginleft, marginbottom)
    return(self)


  def scatter_chart(self , x, y, color, size, palette, fontsize, marginleft, marginbottom):
    """A tried and true classic

      :param str x: The column containing the x coordinates of the marks
      :param str y: The column containing the y coordinates of the marks
      :param str color: The column that should be used to group the marks into different colors
      :param str size: The column the marks should be propotional in area to.
      :param str palette: Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
      :param str fontsize: The size of the font to be used
      :param str marginleft: The left margin
      :param str marginbottom: The Bottom margin

    """
    self.add_step("scatter_chart" , x, y, color, size, palette, fontsize, marginleft, marginbottom)
    return(self)


  def select(self , columns):
    """Keep only a subset of columns

      :param str columns: The list of columns to keep

    """
    self.add_step("select" , columns)
    return(self)


  def slice(self , start, end):
    """Keep only a contiguous subset of rows

      :param str start: The starting index(included)
      :param str end: The ending index(not included)

    """
    self.add_step("slice" , start, end)
    return(self)


  def sort(self , field, order):
    """Sort rows of data based on the values in selected columns

      :param str field: The list of columns to sort by
      :param str order: The order in which to sort, default - ascending

    """
    self.add_step("sort" , field, order)
    return(self)


  def summarize(self , group, field, summarizer):
    """Select columns to aggregate and others to keep unmodified

      :param str group: The list of columns by which to group
      :param str field: The list of columns who's values to collect
      :param str summarizer: The summarizer method to aggregate the values collected, default- count

    """
    self.add_step("summarize" , group, field, summarizer)
    return(self)


  def treemap_chart(self , label, size, palette, fontsize, marginleft, marginbottom):
    """Choose a column to map into colored blocks, and another to further subdivide by size

      :param str label: The column to be used as labels and colorcode the rectangular sectors
      :param str size: The column to which the area of the rectangular sections should be in propotion to
      :param str palette: the D3 Palette to determine the color scheme to use
      :param str fontsize: The size of the font
      :param str marginleft: The left margin
      :param str marginbottom: The bottom margin

    """
    self.add_step("treemap_chart" , label, size, palette, fontsize, marginleft, marginbottom)
    return(self)


  def waffle_chart(self , x, y, wafflesizelabel, palette):
    """A square pie chart; still not edible

      :param str x: 
      :param str y: 
      :param str wafflesizelabel: 
      :param str palette: 

    """
    self.add_step("waffle_chart" , x, y, wafflesizelabel, palette)
    return(self)


  def waterfall_chart(self , x, y, fontsize, marginleft, marginbottom):
    """Lay out cascades of data next to a towering waterfall representing the total

      :param str x: The column that sets the x coordinates
      :param str y: A cumalative sum is calculated on this column and then the difference are visualized
      :param str fontsize: The font size
      :param str marginleft: The left margin
      :param str marginbottom: The bottom margin

    """
    self.add_step("waterfall_chart" , x, y, fontsize, marginleft, marginbottom)
    return(self)


  def website(self , site):
    """Embed a website and load a URL

      :param str site: 

    """
    self.add_step("website" , site)
    return(self)


  def wordcloud_chart(self , label, size):
    """Make the most frequent words in a dataset stand out in a trendy way

      :param str label: The column containing words to be added to the cloud
      :param str size: The column the size of the words should be in propotion to

    """
    self.add_step("wordcloud_chart" , label, size)
    return(self)
