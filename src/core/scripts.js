// import scripts
import graphqltxt from '../../scripts/import/graphql.js';
import imagestxt from '../../scripts/import/images.js';
import importcsvtxt from '../../scripts/import/csv.js';
import importexceltxt from '../../scripts/import/excel.js';
import importjsontxt from '../../scripts/import/json.js';
import iristxt from '../../scripts/import/iris.js';
import mysqltxt from '../../scripts/import/mysql.js';
import stockstxt from '../../scripts/import/stocks.js';
import videoframestxt from '../../scripts/import/videoframes.js';
import webcamtxt from '../../scripts/import/webcam.js';
import sqlitetxt from '../../scripts/import/sqlite.js';
import dataframetxt from '../../scripts/import/dataframe.js';

// webscraping scripts
import webimagestxt from '../../scripts/import/webimages.js';
import webselectortxt from '../../scripts/import/webselector.js';
import webtablestxt from '../../scripts/import/webtable.js';

// transform scripts
import assigntxt from '../../scripts/transforms/assign.js';
import converttxt from '../../scripts/transforms/convert.js';
import derivetxt from '../../scripts/transforms/derive.js';
import droptxt from '../../scripts/transforms/drop.js';
import fetchtxt from '../../scripts/transforms/fetch.js';
import filtertxt from '../../scripts/transforms/filter.js';
import foldtxt from '../../scripts/transforms/fold.js';
import imputetxt from '../../scripts/transforms/impute.js';
import pivottxt from '../../scripts/transforms/pivot.js';
import rollingsumtxt from '../../scripts/transforms/rollingsum.js';
import sampletxt from '../../scripts/transforms/sample.js';
import selecttxt from '../../scripts/transforms/select.js';
import slicetxt from '../../scripts/transforms/slice.js';
import sorttxt from '../../scripts/transforms/sort.js';
import summarizetxt from '../../scripts/transforms/summarize.js';

// chart scripts
import barcharttxt from '../../scripts/charts/barchart.js';
import boxplotcharttxt from '../../scripts/charts/boxplotchart.py';
import dotplotcharttxt from '../../scripts/charts/dotplotchart.js';
import violinplotcharttxt from '../../scripts/charts/violinplotchart.py';
import errorbarcharttxt from '../../scripts/charts/errorbarchart.js';
import heatmapcharttxt from '../../scripts/charts/heatmapchart.js';
import histogramcharttxt from '../../scripts/charts/histogramchart.js';
import linecharttxt from '../../scripts/charts/linechart.js';
import sankeycharttxt from '../../scripts/charts/sankeychart.js';
import scattercharttxt from '../../scripts/charts/scatterchart.js';
import treemapcharttxt from '../../scripts/charts/treemapchart.js';

// visualization scripts
import bubblestxt from '../../scripts/visualizations/bubbles.js';
import facetstxt from '../../scripts/visualizations/facets.js';
import funneltxt from '../../scripts/visualizations/funnel.js';
import gallerytxt from '../../scripts/visualizations/gallery.html';
import mapcharttxt from '../../scripts/visualizations/map.js';
import networktxt from '../../scripts/visualizations/network.js';
import plotlychartstxt from '../../scripts/visualizations/plotlycharts.js';
import radialbarstxt from '../../scripts/visualizations/radialbars.js';
import regressioncharttxt from '../../scripts/visualizations/regression.js';
import simpletabletxt from '../../scripts/visualizations/simpletable.html';
import wafflecharttxt from '../../scripts/visualizations/waffle.js';
import waterfallcharttxt from '../../scripts/visualizations/waterfall.js';
import wordcloudtxt from '../../scripts/visualizations/wordcloud.js';

// prediction scripts
import movenettxt from '../../scripts/predict/movenet.js';
import mobilenettxt from '../../scripts/predict/mobilenet.js';
import sentimenttxt from '../../scripts/predict/sentiment.js';

// prediction / timeseries scripts
import autoregressivetxt from '../../scripts/timeseries/autoregressive.py';
import lstmtxt from '../../scripts/timeseries/lstm.js';
import movingaveragetxt from '../../scripts/timeseries/movingaverage.js';
import prophettxt from '../../scripts/timeseries/prophet.py';
import seasonalitytxt from '../../scripts/timeseries/seasonality.py';

// train scripts
import predicttxt from '../../scripts/train/predict.py';
import linearregressiontxt from '../../scripts/train/linearregression.py';
import logisiticregressiontxt from '../../scripts/train/logisticregression.py';
import pycarettxt from '../../scripts/train/pycaret.py';
import traintesttxt from '../../scripts/train/traintest.py';

// stats scripts
import shapirotxt from '../../scripts/stats/shapiro.py';
import abtesttxt from '../../scripts/stats/abtest.py';

// util scripts
import citytomaptxt from '../../scripts/utils/citytomap.js';
import copytxt from '../../scripts/utils/copy.js';
import pastetxt from '../../scripts/utils/paste.js';
import tojsontxt from '../../scripts/utils/tojson.js';
import upscalertxt from '../../scripts/utils/upscaler.js';
import ziptomaptxt from '../../scripts/utils/ziptomap.js';
import stoptxt from '../../scripts/utils/stop.js';

// export scripts
import exportcsvtxt from '../../scripts/export/csv.js';
import exporttexttxt from '../../scripts/export/text.js';
import exportjsontxt from '../../scripts/export/json.js';
import exportxmltxt from '../../scripts/export/xml.js';

// service scripts
import airbnbtxt from '../../scripts/services/airbnb.js';
import bigquerytxt from '../../scripts/services/bigquery.js';
import datagrabiotxt from '../../scripts/services/datagrabio.html';
import googlesheetstxt from '../../scripts/services/googlesheets.js';
import powerbitxt from '../../scripts/services/powerbi.html';
import reddittxt from '../../scripts/services/reddit.js';
import tableautxt from '../../scripts/services/tableau.html';
import twittertxt from '../../scripts/services/twitter.js';

// language scripts
import htmltxt from '../../scripts/languages/html.html';
import javascripttxt from '../../scripts/languages/javascript.js';
import markdowntxt from '../../scripts/languages/markdown.md';
import pyodidetxt from '../../scripts/languages/pyodide.py';
import pythontxt from '../../scripts/languages/python.py';
import rtxt from '../../scripts/languages/r.r';

// framework scripts
import flasktxt from '../../scripts/frameworks/flask.py';
import plumbertxt from '../../scripts/frameworks/plumber.r';
import pyscripttxt from '../../scripts/frameworks/pyscript.html';
import reacttxt from '../../scripts/frameworks/react.html';
import vuetxt from '../../scripts/frameworks/vue.html';

// control scripts
import checkboxctrltxt from '../../scripts/controls/checkbox.html';
import dropdownctrltxt from '../../scripts/controls/dropdown.html';
import inputfilectrltxt from '../../scripts/controls/inputfile.html';
import messagectrltxt from '../../scripts/controls/message.html';
import numberctrltxt from '../../scripts/controls/number.html';
import rangectrltxt from '../../scripts/controls/range.html';
import rawhtmltxt from '../../scripts/controls/rawhtml.js';
import spreadsheetctrltxt from '../../scripts/controls/spreadsheet.html';
import textareactrltxt from '../../scripts/controls/textarea.js';
import textboxctrltxt from '../../scripts/controls/textbox.html';
import websitectrltxt from '../../scripts/controls/website.js';

// business scripts
import churntxt from '../../scripts/business/churn.py';

var fetchedScripts = {};

const scripts = {
  // import
  graphql: { script: graphqltxt, language: 'javascript' },
  images: { script: imagestxt, language: 'javascript' },
  importcsv: { script: importcsvtxt, language: 'javascript' },
  importexcel: { script: importexceltxt, language: 'javascript' },
  importjson: { script: importjsontxt, language: 'javascript' },
  iris: { script: iristxt, language: 'javascript' },
  mysql: { script: mysqltxt, language: 'javascript' },
  stocks: { script: stockstxt, language: 'javascript' },
  videoframes: { script: videoframestxt, language: 'javascript' },
  webcam: { script: webcamtxt, language: 'javascript' },
  sqlite: { script: sqlitetxt, language: 'javascript' },
  dataframe: { script: dataframetxt, language: 'javascript' },

  // webscraping
  webimages: { script: webimagestxt, language: 'javascript' },
  webselector: { script: webselectortxt, language: 'javascript' },
  webtables: { script: webtablestxt, language: 'javascript' },

  // transforms
  assign: { script: assigntxt, language: 'javascript' },
  convert: { script: converttxt, language: 'javascript' },
  derive: { script: derivetxt, language: 'javascript' },
  drop: { script: droptxt, language: 'javascript' },
  filter: { script: filtertxt, language: 'javascript' },
  fold: { script: foldtxt, language: 'javascript' },
  impute: { script: imputetxt, language: 'javascript' },
  pivot: { script: pivottxt, language: 'javascript' },
  rollingsum: { script: rollingsumtxt, language: 'javascript' },
  sample: { script: sampletxt, language: 'javascript' },
  select: { script: selecttxt, language: 'javascript' },
  slice: { script: slicetxt, language: 'javascript' },
  sort: { script: sorttxt, language: 'javascript' },
  summarize: { script: summarizetxt, language: 'javascript' },

  // charts
  barchart: { script: barcharttxt, language: 'javascript' },
  boxplotchart: { script: boxplotcharttxt, language: 'pyodide' },
  dotplotchart: { script: dotplotcharttxt, language: 'javascript' },
  errorbarchart: { script: errorbarcharttxt, language: 'javascript' },
  heatmapchart: { script: heatmapcharttxt, language: 'javascript' },
  histogramchart: { script: histogramcharttxt, language: 'javascript' },
  violinchart: { script: violinplotcharttxt, language: 'pyodide' },
  linechart: { script: linecharttxt, language: 'javascript' },
  sankeychart: { script: sankeycharttxt, language: 'javascript' },
  scatterchart: { script: scattercharttxt, language: 'javascript' },
  treemapchart: { script: treemapcharttxt, language: 'javascript' },

  // visualizations
  bubbles: { script: bubblestxt, language: 'javascript' },
  facets: { script: facetstxt, language: 'javascript' },
  funnel: { script: funneltxt, language: 'javascript' },
  gallery: { script: gallerytxt, language: 'html' },
  mapchart: { script: mapcharttxt, language: 'javascript' },
  network: { script: networktxt, language: 'javascript' },
  plotly: { script: plotlychartstxt, language: 'javascript' },
  radialbars: { script: radialbarstxt, language: 'javascript' },
  regressionchart: { script: regressioncharttxt, language: 'javascript' },
  waffle: { script: wafflecharttxt, language: 'javascript' },
  wordcloud: { script: wordcloudtxt, language: 'javascript' },
  waterfall: { script: waterfallcharttxt, language: 'javascript' },
  table: { script: simpletabletxt, language: 'html' },

  // predictions
  bodypix: { script: movenettxt, language: 'javascript' },
  mobilenet: { script: mobilenettxt, language: 'javascript' },
  sentiment: { script: sentimenttxt, language: 'javascript' },

  // prediction / time
  timeauto: { script: autoregressivetxt, language: 'python' },
  timelstm: { script: lstmtxt, language: 'javascript' },
  timemovingaverage: { script: movingaveragetxt, language: 'javascript' },
  timeprophet: { script: prophettxt, language: 'python' },
  timeseasonality: { script: seasonalitytxt, language: 'pyodide' },

  // train
  predict: { script: predicttxt, language: 'python' },
  linearregression: { script: linearregressiontxt, language: 'python' },
  traintest: { script: traintesttxt, language: 'python' },
  logisiticregression: { script: logisiticregressiontxt, language: 'python' },
  pycaret: { script: pycarettxt, language: 'python' },

  // stats
  shapiro: { script: shapirotxt, language: 'pyodide' },
  abtest: { script: abtesttxt, language: 'pyodide' },

  // utils
  citytomap: { script: citytomaptxt, language: 'javascript' },
  copy: { script: copytxt, language: 'javascript' },
  fetch: { script: fetchtxt, language: 'javascript' },
  paste: { script: pastetxt, language: 'javascript' },
  tojson: { script: tojsontxt, language: 'javascript' },
  upscaler: { script: upscalertxt, language: 'javascript' },
  ziptomap: { script: ziptomaptxt, language: 'javascript' },
  stop: { script: stoptxt, language: 'javascript' },

  // export
  exportcsv: { script: exportcsvtxt, language: 'javascript' },
  exporttext: { script: exporttexttxt, language: 'javascript' },
  exportjson: { script: exportjsontxt, language: 'javascript' },
  exportxml: { script: exportxmltxt, language: 'javascript' },

  // services
  airbnb: { script: airbnbtxt, language: 'javascript' },
  bigquery: { script: bigquerytxt, language: 'javascript' },
  datagrabio: { script: datagrabiotxt, language: 'html' },
  googlesheets: { script: googlesheetstxt, language: 'javascript' },
  powerbi: { script: powerbitxt, language: 'html' },
  reddit: { script: reddittxt, language: 'javascript' },
  tableau: { script: tableautxt, language: 'html' },
  twitter: { script: twittertxt, language: 'javascript' },

  // languages
  html: { script: htmltxt, language: 'html' },
  javascript: { script: javascripttxt, language: 'javascript' },
  markdown: { script: markdowntxt, language: 'markdown' },
  pyodide: { script: pyodidetxt, language: 'pyodide' },
  python: { script: pythontxt, language: 'python' },
  r: { script: rtxt, language: 'r' },

  // frameworks
  flask: { script: flasktxt, language: 'flask' },
  plumber: { script: plumbertxt, language: 'plumber' },
  pyscript: { script: pyscripttxt, language: 'html' },
  react: { script: reacttxt, language: 'html' },
  vue: { script: vuetxt, language: 'html' },

  // controls
  checkbox: { script: checkboxctrltxt, language: 'html' },
  dropdown: { script: dropdownctrltxt, language: 'html' },
  fileinput: { script: inputfilectrltxt, language: 'html' },
  message: { script: messagectrltxt, language: 'html' },
  numberinput: { script: numberctrltxt, language: 'html' },
  rawhtml: { script: rawhtmltxt, language: 'javascript' },
  slider: { script: rangectrltxt, language: 'html' },
  sheet: { script: spreadsheetctrltxt, language: 'html' },
  textarea: { script: textareactrltxt, language: 'javascript' },
  textbox: { script: textboxctrltxt, language: 'html' },
  website: { script: websitectrltxt, language: 'javascript' },

  // business
  churn: { script: churntxt, language: 'pyodide' },
}

export const fetchScripts = async (steps /*: steps */) => {
  if (!steps) return;
  await Promise.all(steps.map(step => {
    return (async (step) => {
      if (step.url && !fetchedScripts[step.url]) {
        const fullUrl = step.url.startsWith('http://') || step.url.startsWith('https://');
        const url = fullUrl ? step.url : 'https://raw.githubusercontent.com/hal9ai/hal9ai/main/scripts/' + step.url;
        const response = await fetch(url);
        fetchedScripts[step.url] = await response.text();
      }
    })(step);
  }));
}

export const scriptFromStep = (pipeline /* pipeline */, step /*: step */) /*: string */ => {
  var language = step.language;
  var text = undefined;

  if (pipeline.scripts[step.id])
    text = pipeline.scripts[step.id];
  else if (fetchedScripts[step.url])
    text = fetchedScripts[step.url];
  else if (scripts[step.name]) {
    text = scripts[step.name].script;
    language = scripts[step.name].language;
  } else if (step.inlineScript) {
    text = step.inlineScript;
    language = step.inlineScriptLanguage;
  } else {
    text = '';
  }

  return { script: text, language: language };
}