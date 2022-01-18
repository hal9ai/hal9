
export default function(html) {
  var script = '\nif (html) html.innerHTML = `' + html.replace(/`/g, '\\`').replace(/\${/g, '\\${') + '`;\n\n';

  script +=  `
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
        
        const loaded = new Promise((resolve, reject) => {
          const errorHandler = function(e) {
            window.removeEventListener('error', errorHandler);
            reject(e.message);
          }

          const loadHandler = function() {
            window.removeEventListener('error', errorHandler);
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

        if (script.type == 'text/jsx' || script.type == 'text/babel')
          code = Babel.transform(code, { presets: ['env', 'react'] }).code;

        const fn = new Function(Object.keys(_hal9_params), code);
        fn(...Object.values(_hal9_params));
      }
      else {
        hasUnknownType = true;
      }
    };

    if (hasUnknownType) {
      window.dispatchEvent(new Event('DOMContentLoaded'));
    }
  `;

  return {
    script: script
  };
}
