import markdown from './markdown';
import html from './html';
import python from './python';
import rstats from './rstats';
import pyodide from './pyodide';
import plumber from './plumber';
import * as snippets from '../snippets';

const languageMap = {
  markdown: markdown,
  html: html,
  python: python,
  r: rstats,
  pyodide: pyodide,
  plumber: plumber,
}

export const interpret = async (script, language, header, context) => {
  const interpreter = languageMap[language];

  const result = interpreter ? await interpreter(script, header, context) : { script: script };

  if (!result.header) {
    result.header = header ? header : snippets.parseHeader(code);
  }

  return result;
}
