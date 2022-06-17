// import scripts
import graphqltxt from '../../scripts/import/graphql.txt.js';
import imagestxt from '../../scripts/import/images.txt.js';
import importcsvtxt from '../../scripts/import/csv.txt.js';
import importexceltxt from '../../scripts/import/excel.txt.js';
import importjsontxt from '../../scripts/import/json.txt.js';
import iristxt from '../../scripts/import/iris.txt.js';
import mysqltxt from '../../scripts/import/mysql.txt.js';
import stockstxt from '../../scripts/import/stocks.txt.js';
import videoframestxt from '../../scripts/import/videoframes.txt.js';
import webcamtxt from '../../scripts/import/webcam.txt.js';
import sqlitetxt from '../../scripts/import/sqlite.txt.js';

// webscraping scripts
import webimagestxt from '../../scripts/import/webimages.txt.js';
import webselectortxt from '../../scripts/import/webselector.txt.js';
import webtablestxt from '../../scripts/import/webtable.txt.js';

// transform scripts
import assigntxt from '../../scripts/transforms/assign.txt.js';
import converttxt from '../../scripts/transforms/convert.txt.js';
import derivetxt from '../../scripts/transforms/derive.txt.js';
import droptxt from '../../scripts/transforms/drop.txt.js';
import fetchtxt from '../../scripts/transforms/fetch.txt.js';
import filtertxt from '../../scripts/transforms/filter.txt.js';
import foldtxt from '../../scripts/transforms/fold.txt.js';
import imputetxt from '../../scripts/transforms/impute.txt.js';
import pivottxt from '../../scripts/transforms/pivot.txt.js';
import rollingsumtxt from '../../scripts/transforms/rollingsum.txt.js';
import sampletxt from '../../scripts/transforms/sample.txt.js';
import selecttxt from '../../scripts/transforms/select.txt.js';
import slicetxt from '../../scripts/transforms/slice.txt.js';
import sorttxt from '../../scripts/transforms/sort.txt.js';
import summarizetxt from '../../scripts/transforms/summarize.txt.js';

// chart scripts
import barcharttxt from '../../scripts/charts/barchart.txt.js';
import boxplotcharttxt from '../../scripts/charts/boxplotchart.txt.js';
import dotplotcharttxt from '../../scripts/charts/dotplotchart.txt.js';
import violinplotcharttxt from '../../scripts/charts/violinplotchart.txt';
import errorbarcharttxt from '../../scripts/charts/errorbarchart.txt.js';
import heatmapcharttxt from '../../scripts/charts/heatmapchart.txt.js';
import histogramcharttxt from '../../scripts/charts/histogramchart.txt.js';
import linecharttxt from '../../scripts/charts/linechart.txt.js';
import sankeycharttxt from '../../scripts/charts/sankeychart.txt.js';
import scattercharttxt from '../../scripts/charts/scatterchart.txt.js';
import treemapcharttxt from '../../scripts/charts/treemapchart.txt.js';

// visualization scripts
import bubblestxt from '../../scripts/visualizations/bubbles.txt.js';
import funneltxt from '../../scripts/visualizations/funnel.txt.js';
import gallerytxt from '../../scripts/visualizations/gallery.txt';
import mapcharttxt from '../../scripts/visualizations/map.txt.js';
import networktxt from '../../scripts/visualizations/network.txt.js';
import plotlychartstxt from '../../scripts/visualizations/plotlycharts.txt.js';
import radialbarstxt from '../../scripts/visualizations/radialbars.txt.js';
import simpletabletxt from '../../scripts/visualizations/simpletable.txt';
import wafflecharttxt from '../../scripts/visualizations/waffle.txt.js';
import waterfallcharttxt from '../../scripts/visualizations/waterfall.txt.js';
import wordcloudtxt from '../../scripts/visualizations/wordcloud.txt.js';

// prediction scripts
import movenettxt from '../../scripts/predict/movenet.txt.js';
import mobilenettxt from '../../scripts/predict/mobilenet.txt.js';
import regressionpredicttxt from '../../scripts/predict/regression.txt.js';
import sentimenttxt from '../../scripts/predict/sentiment.txt.js';

// prediction / timeseries scripts
import autoregressivetxt from '../../scripts/timeseries/autoregressive.py';
import lstmtxt from '../../scripts/timeseries/lstm.txt.js';
import movingaveragetxt from '../../scripts/timeseries/movingaverage.txt.js';
import prophettxt from '../../scripts/timeseries/prophet.py';
import seasonalitytxt from '../../scripts/timeseries/seasonality.py';

// train scripts
import predicttxt from '../../scripts/train/predict.py';
import linearregressiontxt from '../../scripts/train/linearregression.py';
import logisiticregressiontxt from '../../scripts/train/logisticregression.py';
import pycarettxt from '../../scripts/train/pycaret.py';
import traintesttxt from '../../scripts/train/traintest.py';

// stats scripts
import shapirotxt from '../../scripts/stats/shapiro.txt.js';
import abtesttxt from '../../scripts/stats/abtest.txt.js';

// util scripts
import citytomaptxt from '../../scripts/utils/citytomap.txt.js';
import copytxt from '../../scripts/utils/copy.txt.js';
import pastetxt from '../../scripts/utils/paste.txt.js';
import tojsontxt from '../../scripts/utils/tojson.txt.js';
import ziptomaptxt from '../../scripts/utils/ziptomap.txt.js';

// export scripts
import exportcsvtxt from '../../scripts/export/csv.txt.js';
import exporttexttxt from '../../scripts/export/text.txt.js';
import exportjsontxt from '../../scripts/export/json.txt.js';
import exportxmltxt from '../../scripts/export/xml.txt.js';

// service scripts
import airbnbtxt from '../../scripts/services/airbnb.txt.js';
import bigquerytxt from '../../scripts/services/bigquery.txt.js';
import datagrabiotxt from '../../scripts/services/datagrabio.txt';
import googlesheetstxt from '../../scripts/services/googlesheets.txt.js';
import powerbitxt from '../../scripts/services/powerbi.txt';
import reddittxt from '../../scripts/services/reddit.txt.js';
import tableautxt from '../../scripts/services/tableau.txt';
import twittertxt from '../../scripts/services/twitter.txt.js';

// language scripts
import htmltxt from '../../scripts/languages/html.txt';
import javascripttxt from '../../scripts/languages/javascript.txt';
import markdowntxt from '../../scripts/languages/markdown.txt';
import pyodidetxt from '../../scripts/languages/pyodide.txt.js';
import pythontxt from '../../scripts/languages/python.txt';
import rtxt from '../../scripts/languages/r.txt';

// framework scripts
import flasktxt from '../../scripts/frameworks/flask.py';
import plumbertxt from '../../scripts/frameworks/plumber.r';
import pyscripttxt from '../../scripts/frameworks/pyscript.txt';
import reacttxt from '../../scripts/frameworks/react.txt';
import vuetxt from '../../scripts/frameworks/vue.txt';

// control scripts
import dropdownctrltxt from '../../scripts/controls/dropdown.txt.js';
import inputfilectrltxt from '../../scripts/controls/inputfile.txt.js';
import numberctrltxt from '../../scripts/controls/number.txt.js';
import rangectrltxt from '../../scripts/controls/range.txt.js';
import spreadsheetctrltxt from '../../scripts/controls/spreadsheet.txt';
import textareactrltxt from '../../scripts/controls/textarea.txt.js';
import textboxctrltxt from '../../scripts/controls/textbox.txt.js';
import websitectrltxt from '../../scripts/controls/website.txt.js';

// business scripts
import churntxt from '../../scripts/business/churn.txt.js';

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
  funnel: { script: funneltxt, language: 'javascript' },
  gallery: { script: gallerytxt, language: 'html' },
  mapchart: { script: mapcharttxt, language: 'javascript' },
  network: { script: networktxt, language: 'javascript' },
  plotlycharts: { script: plotlychartstxt, language: 'javascript' },
  radialbars: { script: radialbarstxt, language: 'javascript' },
  wafflechart: { script: wafflecharttxt, language: 'javascript' },
  wordcloud: { script: wordcloudtxt, language: 'javascript' },
  waterfallchart: { script: waterfallcharttxt, language: 'javascript' },
  table: { script: simpletabletxt, language: 'html' },

  // predictions
  bodypix: { script: movenettxt, language: 'javascript' },
  mobilenet: { script: mobilenettxt, language: 'javascript' },
  regressionpredict: { script: regressionpredicttxt, language: 'javascript' },
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
  ziptomap: { script: ziptomaptxt, language: 'javascript' },

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
  dropdownctrl: { script: dropdownctrltxt, language: 'javascript' },
  inputfilectrl: { script: inputfilectrltxt, language: 'javascript' },
  numberctrl: { script: numberctrltxt, language: 'javascript' },
  rangectrl: { script: rangectrltxt, language: 'javascript' },
  spreadsheetctrl: { script: spreadsheetctrltxt, language: 'html' },
  textareactrl: { script: textareactrltxt, language: 'javascript' },
  textboxctrl: { script: textboxctrltxt, language: 'javascript' },
  websitectrl: { script: websitectrltxt, language: 'javascript' },

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