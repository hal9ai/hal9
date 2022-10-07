import { debuggerIf } from '../utils/debug'
import { loadScripts } from '../utils/scriptloader'

export default async function(markdown) {
  const debugcode = debuggerIf('interpret');

  await loadScripts([
    'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js'
  ]);

  var showdown = null;
  if (typeof(window) != 'undefined') showdown = window.showdown;

  const converter = new showdown.Converter();
  const script = debugcode + '\nif (html) html.innerHTML = `\n' + converter.makeHtml(markdown) + '\n`;';

  return {
    script: script
  };
}
