// @flow

import yaml from 'js-yaml';

/*::
type params = { [key: string]: Array<string> };
type flatparams = Array<string>;
type deps = Array<string>;
type func = (...args: Array<any>) => any;
type header = { params: Array<string>, deps: Array<string> };
*/

import iristxt from '../../scripts/datasets/iris.txt.js';

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

export const getFunctionBody = async function(code /*: string */, params /*: params */, nodeps /*: boolean */) /*: string */ {
  const name = 'snippet' + Math.floor(Math.random() * 10000000);

  const header = parseHeader(code);
  const deps = !nodeps ? header.deps : [];
  const output = header.output;
  
  for (var depidx in deps) {
    var dep = deps[depidx];
    if (!Object.keys(depsCache).includes(dep)) {
      var promise = new Promise((accept, reject) => {
        var script = document.createElement('script');
        script.src = dep;
        document.head.appendChild(script);
        script.addEventListener("load", function(event) {
          depsCache[dep] = true;
          accept();
        });
        script.addEventListener("error", function(event) {
          reject();
        });
      });

      await promise;
    }
  };

  const returns = '{ ' + output.map((e) => e + ': ' + e).join(', ') + ' }';

  const injectdebug = (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) ? 'debugger;\n' : '';

  const vars = Object.keys(params).map((param) => 'var ' + param + ' = _hal9_params[\'' + param + '\'];').join('\n');
  const body = 'async function ' + name + '(_hal9_params)' + ' {\n' + 
      injectdebug +
      vars + '\n\n' + code + '\n' +
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

  // $FlowFixMe
  return op(params);
}
