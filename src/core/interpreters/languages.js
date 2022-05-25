const languageInfo = {
  flask: {
    html: false
  },
  html: {
    html: true,
    height: 'auto'
  },
  markdown: {
    html: true,
    height: 'auto'
  },
  plumber: {
    html: false
  },
  pyodide: {
    html: false
  },
  python: {
    html: false,
  },
  r: {
    html: false,
  },
}

export const getLanguageInfo = (lang) => {
  return languageInfo[lang] ? languageInfo[lang] : {
    html: false
  };
}
