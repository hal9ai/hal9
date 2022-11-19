/**
  input: []
  params:
    - name: rawhtml
      type: string
      example: Hello World
      description: An HTML string with arbitrary HTML to render.
      label: html
  output: [ html ]
  layout:
    - width: 200px
      height: 200px
  state: session
  interactive: true
**/

async function fixScripts() {
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
        tag.innerHTML = script.innerHTML + ';hal9HtmlScriptLoaded();';
      else
        tag.src = script.src;

      script.remove();

      if (!window.hal9htmlscripts) window.hal9htmlscripts = {};
      if (script.src && window.hal9htmlscripts[script.src] === 'loaded') continue;
      
      const loaded = new Promise((resolve, reject) => {
        const errorHandler = function(e) {
          window.removeEventListener('error', errorHandler);
          reject('HTML Failed to load ' + e.srcElement.src + (e.message ? ': ' + e.message : ''));
        }

        const loadHandler = function() {
          window.removeEventListener('error', errorHandler);
          if (script.src) window.hal9scripts[script.src] = 'loaded'
          resolve();
        }

        window.addEventListener('error', errorHandler);
        window.hal9HtmlScriptLoaded = loadHandler;

        tag.addEventListener('load', loadHandler);
        tag.addEventListener('error', errorHandler);
        tag.addEventListener('abort', errorHandler);   
      });

      htmlref.appendChild(tag);

      await loaded;
    }
    else if (!script.type || script.type == 'text/javascript' || script.type == 'text/jsx' || script.type == 'text/jsx' || script.type == 'text/babel') {
      var code = script.innerHTML;

      if (script.type == 'text/jsx' || script.type == 'text/babel')
        code = Babel.transform(code, { presets: ['env', 'react'] }).code;

      const fn = new Function([], code);

      await fn(...Object.values(_hal9_params));
    }
    else {
      throw('Unsupported script type in HTML')
    }
  }
}

hal9.onEvent('param', async function(param, value) {
  if (value === null || param != 'rawhtml') return;
  
  html.innerHTML = value;
  await fixScripts()
})
