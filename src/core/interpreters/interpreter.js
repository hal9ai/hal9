import markdown from './markdown';
import html from './html';
import python from './python';
import rstats from './rstats';
import pyodide from './pyodide';

const languageMap = {
  markdown: markdown,
  html: html,
  python: python,
  r: rstats,
  pyodide: pyodide
}

export const interpret = (script, language, header, context) => {
  const interpreter = languageMap[language];

  return interpreter ? interpreter(script, header, context) : script;
}
