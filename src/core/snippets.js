// @flow

import yaml from 'js-yaml';

/*::
type params = { [key: string]: Array<string> };
type flatparams = Array<string>;
type deps = Array<string>;
type func = (...args: Array<any>) => any;
type header = { params: Array<string>, deps: Array<string> };
*/

var depsCache = {};

const fixHeaderEncoding = (header /* string */) /*: string */ => {
  // To fix issues like pasting code from email clients, which use nbsp (160).
  var fixed = '';
  for (let i = 0; i < header.length; i++) {
    if (header.charCodeAt(i) == 160)
      fixed = fixed + ' ';
    else 
      fixed = fixed + header.charAt(i);
  }
  
  return fixed;
}

export const parseHeader = (code /*: string */) /*: header */ => {
  const error = 'Code requires YAML parameters like /** params: [ param1, param2, param3 ] **/';

  var header = null;
  var hashtagHeader = false;
  var headers = code.match(/\/\*\*(.|[\r\n])+\*\*\//g);
  if (!headers || headers.length == 0) {
    // attempt with python/rstats comments
    headers = code.match(/(##[^#\n]+[\r\n])+/g);

    if (!headers || headers.length == 0) {
      return { params: [], input: [ 'data' ], deps: [], output: [ 'data' ] };
    }
    else {
      hashtagHeader = true;
      header = headers[0].replace(/(^##)/g, '').replace(/([\r\n]##)/g, '\r\n');
    }
  }
  else {
    header = headers[0].replace(/(^\/\*\*)|(\*\*\/$)/g, '');
  }

  var invalid = null;
  var parsed = {};

  header = fixHeaderEncoding(header);

  try {
    parsed = yaml.safeLoad(header);

    // no header, give default
    if (parsed === null) parsed = {};
  }
  catch(e) {
    if (hashtagHeader && !header.includes(':')) {
      // markdown blocks use ## so we ignore errors when is not an actual header
      return { params: [], input: [ 'data' ], deps: [], output: [ 'data' ] };
    }
    else {
      invalid = e.toString();
    }
  }

  return Object.assign(parsed, {
    input: parsed.input ? parsed.input : [ 'data' ],
    params: parsed.params ? parsed.params : [],
    deps: parsed.deps ? parsed.deps : [],
    environment: parsed.environment ? parsed.environment : null,
    cache: parsed.cache === true,
    invalid: invalid,
    output: parsed.output ? parsed.output : [ 'data' ]
  });
}

export const parseParams = (code /*: string */) /*: flatparams */ => {
  const header = parseHeader(code);
  return header.params;
}

const upgradeDep = (dep) => {
  if (dep == 'https://cdn.jsdelivr.net/npm/hal9-utils@0.0.4/dist/hal9-utils.min.js')
    return 'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js'

  return dep;
} 

const loadDepsForBrowser = async function(deps, params) {
  for (var depidx in deps) {
    var dep = upgradeDep(deps[depidx]);
    if (!Object.keys(depsCache).includes(dep) || depsCache[dep] === 'loading') {
      var promise = null;
      if (depsCache[dep] === 'loading') {
        promise = new Promise((accept, reject) => {
          var check = () => {
            if (depsCache[dep] === 'loading') {
              setTimeout(check, 100);
            }
            else {
              if (depsCache[dep] === 'loaded')
                accept();
              else
                reject();
            }
          }
        })
      }
      else {
        promise = new Promise((accept, reject) => {
          var script = document.createElement('script');
          depsCache[dep] = 'loading';
          script.src = dep;
          document.head.appendChild(script);
          script.addEventListener("load", function(event) {
            depsCache[dep] = 'loaded';
            accept();
          });
          script.addEventListener("error", function(event) {
            depsCache[dep] = 'error';
            reject();
          });
        });
      }

      await promise;
    }
  };

  return '';
}

const loadDepsForJS = async function(deps, params) {
  const depscode = await Promise.all(deps.map(dep => {
    if (Object.keys(depsCache).includes(dep))
      return Promise.resolve(depsCache[dep]);
    else {
      const fetchFunc = typeof fetch === 'function' ? fetch : params.fetch;
      return fetchFunc(dep).then(resp => resp.text());
    }
  }));

  deps.map((dep, idx) => {
    depsCache[dep] = depscode[idx];
  });

  return depscode.join('\n') + '\n\n';
}

export const getFunctionBody = async function(code /*: string */, params /*: params */, nodeps /*: boolean */) /*: string */ {
  const name = 'snippet' + Math.floor(Math.random() * 10000000);

  const header = parseHeader(code);
  const deps = !nodeps ? header.deps : [];
  const output = header.output;
  
  const loadDependencies = typeof(window) != 'undefined' ? loadDepsForBrowser : loadDepsForJS;
  const depscode =await loadDependencies(deps, params);

  const returns = '{ ' + output.map((e) => e + ': ' + e).join(', ') + ' }';

  const injectdebug = (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) ? 'debugger;\n' : '';

  const vars = Object.keys(params)
    .map((param) => {
      return 'var ' + param + ' = _hal9_params[\'' + param + '\'];'
    }).join('\n');
  
  const body = 'async function ' + name + '(_hal9_params)' + ' {\n' + 
      injectdebug +
      vars + '\n\n' + depscode + code + '\n' +
      'return '+  returns + ';\n' +
    '}';

  return body;
}

export const getFunction = async function(code /*: string */, params /*: params */) /*: Promise<func> */ {
  const body = await getFunctionBody(code, params, false);

  // $FlowFixMe
  return new Function("return " + body)();
}

export const runFunction = async function(code /*: string */, params /*: params */) /*: void */ {
  const op = await getFunction(code, params);

  params['hal9'] = Object.assign(typeof(window) != 'undefined' && window.hal9 ? window.hal9 : {}, params['hal9']);

  // $FlowFixMe
  return op(params);
}
