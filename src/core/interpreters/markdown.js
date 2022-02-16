import { debuggerIf } from '../utils/debug'
import { loadDepsForBrowser } from '../snippets'

export default async function(markdown) {
  const debugcode = debuggerIf('interpret');

  await loadDepsForBrowser([
    'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js'
  ], {});

  var showdown = null;
  if (typeof(window) != 'undefined') showdown = window.showdown;

  const converter = new showdown.Converter();
  const script = debugcode + '\nif (html) html.innerHTML = `\n' + converter.makeHtml(markdown) + '\n`;';

  return {
    script: script
  };
}
