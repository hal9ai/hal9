// @flow

import yaml from 'js-yaml';

/*::
type params = { [key: string]: Array<string> };
type flatparams = Array<string>;
type deps = Array<string>;
type func = (...args: Array<any>) => any;
type header = { params: Array<string>, deps: Array<string> };
*/

import iristxt from '../scripts/datasets/iris.txt.js';

const depsLocal = {
  'iris.txt.js': iristxt,
};

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

  const headers = code.match(/\/\*\*(.|[\r\n])*\*\*\//g);
  if (!headers || headers.length == 0) return { params: [], input: [ 'data' ], deps: [], output: [ 'data' ] };

  var header = headers[0].replace(/(^\/\*\*)|(\*\*\/$)/g, '');
  var invalid = null;
  var parsed = {};

  header = fixHeaderEncoding(header);

  try {
    parsed = yaml.safeLoad(header);
  }
  catch(e) {
    invalid = e.toString();
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

export const getFunction = async function(code /*: string */, params /*: params */) /*: Promise<func> */ {
  const name = 'snippet' + Math.floor(Math.random() * 10000000);

  const header = parseHeader(code);
  const deps = header.deps;
  const output = header.output;

  const depscode = await Promise.all(deps.map(dep => {
    if (Object.keys(depsLocal).includes(dep))
      return Promise.resolve(depsLocal[dep]);
    else if (Object.keys(depsCache).includes(dep))
      return Promise.resolve(depsCache[dep]);
    else {
      const fetchFunc = typeof fetch === 'function' ? fetch : params.fetch;
      return fetchFunc(dep).then(resp => resp.text());
    }
  }));

  deps.map((dep, idx) => {
    depsCache[dep] = depscode[idx];
  });

  const returns = '{ ' + output.map((e) => e + ': ' + e).join(', ') + ' }';

  const injectdebug = (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) ? 'debugger;\n' : '';

  const vars = Object.keys(params).map((param) => 'var ' + param + ' = _hal9_params[\'' + param + '\'];').join('\n');
  const body = 'async function ' + name + '(_hal9_params)' + ' {\n' + 
      injectdebug +
      vars + '\n\n' + depscode.join('\n') + '\n\n' + code + '\n' +
      'return '+  returns + ';\n' +
    '}';

  // $FlowFixMe
  return new Function("return " + body)();
}

export const runFunction = async function(code /*: string */, params /*: params */) /*: void */ {
  const op = await getFunction(code, params);

  // $FlowFixMe
  return op(params);
}
