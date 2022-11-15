
import buttonctrltxt from '../../scripts/controls/button.html';
import charttxt from '../../scripts/controls/chart.html';
import checkboxctrltxt from '../../scripts/controls/checkbox.html';
import dropdownctrltxt from '../../scripts/controls/dropdown.html';
import imagectrltxt from '../../scripts/controls/image.html';
import inputfilectrltxt from '../../scripts/controls/inputfile.html';
import mdctrltxt from '../../scripts/controls/markdown.js';
import messagectrltxt from '../../scripts/controls/message.html';
import numberctrltxt from '../../scripts/controls/number.html';
import rangectrltxt from '../../scripts/controls/range.html';
import rawhtmltxt from '../../scripts/controls/rawhtml.js';
import spreadsheetctrltxt from '../../scripts/controls/spreadsheet.html';
import textareactrltxt from '../../scripts/controls/textarea.js';
import textboxctrltxt from '../../scripts/controls/textbox.html';
import webcamtxt from '../../scripts/controls/webcam.html';
import websitectrltxt from '../../scripts/controls/website.js';

var fetchedScripts = {};

const scripts = {
  // controls
  button: { script: buttonctrltxt, language: 'html' },
  chart: { script: charttxt, language: 'html' },
  checkbox: { script: checkboxctrltxt, language: 'html' },
  dropdown: { script: dropdownctrltxt, language: 'html' },
  fileinput: { script: inputfilectrltxt, language: 'html' },
  image: { script: imagectrltxt, language: 'html' },
  message: { script: messagectrltxt, language: 'html' },
  numberinput: { script: numberctrltxt, language: 'html' },
  html: { script: rawhtmltxt, language: 'javascript' },
  md: { script: mdctrltxt, language: 'js' },
  slider: { script: rangectrltxt, language: 'html' },
  sheet: { script: spreadsheetctrltxt, language: 'html' },
  textarea: { script: textareactrltxt, language: 'javascript' },
  textbox: { script: textboxctrltxt, language: 'html' },
  webcam: { script: webcamtxt, language: 'html' },
  website: { script: websitectrltxt, language: 'javascript' },
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