
export default function(html) {
  var script = '\nif (html) html.innerHTML = `' + html.replace(/`/g, '\\`').replace(/\${/g, '\\${') + '`;\n\n';

  script +=  `
    const scripts = [...html.getElementsByTagName('script')];
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
      else {
        const fn = new Function(Object.keys(_hal9_params), script.innerHTML);
        fn(...Object.values(_hal9_params));
      }
    };
  `;

  return script;
}
