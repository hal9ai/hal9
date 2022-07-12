import { debuggerIf } from '../utils/debug'

export default async function(html, header, context) {
  const debugcode = debuggerIf('interpret');

  const output = header.output ? header.output : [ 'data' ];
  const outputdict = output.filter(e => e != 'html').map((e) => e + ': ' + e).join(', ');
  const outputnoninteractive = output.map(e => e + ' = result.' + e).join('\n');

  var outputinteractive = '';
  var interactiveCheck = '';
  if (header.interactive) {
    interactiveCheck = " && html.innerHTML == ''"
    outputinteractive = output.map(e => e + ' = state.' + e).join('\n');
  }

  var script = debugcode + '\n' +
  'var hal9ModifiedHtml = false;\n' +
  'if (html' + interactiveCheck + ') {\n' +
  '  hal9ModifiedHtml = true;\n' +
  '  html.innerHTML = `' + html.replace(/`/g, '\\`').replace(/\${/g, '\\${') + '`;\n' +
  '}';

  script +=  `
    var result = null;
    if (hal9ModifiedHtml) {
      const scripts = [...html.getElementsByTagName('script')];

      var hasUnknownType = false;
      for (var idx in scripts) {
        const script = scripts[idx];

        var tag = document.createElement("script");

        script.getAttributeNames().forEach(function(name) {
          if (name != 'id') tag.setAttribute(name, script.getAttribute(name));
        });

        if (script.src || script.type == 'module') {
          if (script.type == 'module')
            tag.innerHTML = script.innerHTML + ';hal9ScriptLoaded();';
          else
            tag.src = script.src;

          script.remove();

          if (!window.hal9scripts) window.hal9scripts = {};
          if (script.src && window.hal9scripts[script.src] === 'loaded') continue;
          
          const loaded = new Promise((resolve, reject) => {
            const errorHandler = function(e) {
              window.removeEventListener('error', errorHandler);
              reject(e.message);
            }

            const loadHandler = function() {
              window.removeEventListener('error', errorHandler);
              if (script.src) window.hal9scripts[script.src] = 'loaded'
              resolve();
            }

            window.addEventListener('error', errorHandler);
            window.hal9ScriptLoaded = loadHandler;

            tag.addEventListener('load', loadHandler);
            tag.addEventListener('error', errorHandler);
            tag.addEventListener('abort', errorHandler);   
          });

          html.appendChild(tag);

          await loaded;
        }
        else if (!script.type || script.type == 'text/javascript' || script.type == 'text/jsx' || script.type == 'text/jsx' || script.type == 'text/babel') {
          var code = script.innerHTML;

          if (!script.type || script.type == 'text/javascript') {
            code = code + "\\n" +
              "return { ${outputdict} };"
          }

          if (script.type == 'text/jsx' || script.type == 'text/babel')
            code = Babel.transform(code, { presets: ['env', 'react'] }).code;

          const fn = new Function(Object.keys(_hal9_params), code);

          if (!result)
            result = await fn(...Object.values(_hal9_params));

          ${outputnoninteractive}
        }
        else {
          hasUnknownType = true;
        }
      };

      if (hasUnknownType) {
        window.dispatchEvent(new Event('DOMContentLoaded'));
      }
    } else {
      const state = hal9.getState();
      ${outputinteractive}
    }
  `;

  return {
    script: script
  };
}
