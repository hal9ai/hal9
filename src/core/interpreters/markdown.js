import showdown from 'showdown';

export default function(markdown) {
  const converter = new showdown.Converter();
  const script = '\nif (html) html.innerHTML = `\n' + converter.makeHtml(markdown) + '\n`;';

  return script;
}
