import markdown from './markdown';
import html from './html';

const languageMap = {
  markdown: markdown,
  html: html
}

export const interpret = (script, language) => {
  const interpreter = languageMap[language];

  return interpreter ? interpreter(script) : script;
}
