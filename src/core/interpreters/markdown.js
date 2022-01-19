import showdown from 'showdown';
import { debuggerIf } from '../utils/debug'

export default function(markdown) {
  const debugcode = debuggerIf('interpret');

  const converter = new showdown.Converter();
  const script = debugcode + '\nif (html) html.innerHTML = `\n' + converter.makeHtml(markdown) + '\n`;';

  return {
    script: script
  };
}
