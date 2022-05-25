import markdown from './markdown';
import html from './html';
import python from './python';
import rstats from './rstats';
import pyodide from './pyodide';
import plumber from './plumber';
import flask from './flask';
import * as snippets from '../snippets';

const languageMap = {
  flask: flask,
  html: html,
  markdown: markdown,
  plumber: plumber,
  pyodide: pyodide,
  python: python,
  r: rstats,
}

export const interpret = async (script, language, header, context) => {
  const interpreter = languageMap[language];

  const result = interpreter ? await interpreter(script, header, context) : { script: script };

  if (!result.header) {
    result.header = header ? header : snippets.parseHeader(code);
  }

  return result;
}
