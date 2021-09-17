import markdown from './markdown';
import html from './html';
import python from './python';
import rstats from './rstats';
import pyodide from './pyodide';

const languageMap = {
  markdown: markdown,
  html: html,
  python: python,
  rstats: rstats,
  pyodide: pyodide
}

export const interpret = (script, language, params, inputs, deps, context) => {
  const interpreter = languageMap[language];

  return interpreter ? interpreter(script, params, inputs, deps, context) : script;
}
