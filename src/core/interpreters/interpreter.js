import markdown from './markdown';
import html from './html';
import python from './python';
import rstats from './rstats';
import pyodide from './pyodide';
import * as snippets from '../snippets';

const languageMap = {
  markdown: markdown,
  html: html,
  python: python,
  r: rstats,
  pyodide: pyodide
}

export const interpret = (script, language, header, context) => {
  const interpreter = languageMap[language];

  const result = interpreter ? interpreter(script, header, context) : { script: script };

  if (!result.header) {
    result.header = header ? header : snippets.parseHeader(code);
  }

  return result;
}
