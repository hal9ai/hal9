// @flow

import yaml from 'js-yaml';
import { loadScripts } from './utils/scriptloader';

/*::
type params = { [key: string]: Array<string> };
type flatparams = Array<string>;
type deps = Array<string>;
type func = (...args: Array<any>) => any;
type header = { params: Array<string>, deps: Array<string> };
*/

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
    parsed = yaml.load(header);

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
    output: parsed.output ? parsed.output : [ 'data' ],
    visible: parsed.visible,
  });
}

export const parseParams = (code /*: string */) /*: flatparams */ => {
  const header = parseHeader(code);
  return header.params;
}

export const getFunctionBody = async function(code /*: string */, params /*: params */, nodeps /*: boolean */, header /*: header */) /*: string */ {
  const name = 'snippet' + Math.floor(Math.random() * 10000000);

  header = header ? header : parseHeader(code);
  const deps = !nodeps ? header.deps : [];
  const output = header.output;
  
  const depscode = await loadScripts(deps);

  const returns = '{ ' + output.filter(e => e != 'html').map((e) => e + ': ' + e).join(', ') + ' }';

  const injectdebug = (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) ? 'debugger;\n' : '';

  const vars = Object.keys(params)
    .map((param) => {
      return 'var ' + param + ' = _hal9_params[\'' + param + '\'];'
    }).join('\n');
  
  const body = `async function ${name}(_hal9_params) {
      var hal9__error = null;
      var hal9__returns = {};

      var hal9__console = [];

      try {
        var console = {
          error: function(err) {
            hal9__console.push({ type: 'error', message: err.toString() });
          },
          log: function(log) {
            hal9__console.push({ type: 'log', message: log.toString() });
          },
          warning: function(warn) {
            hal9__console.push({ type: 'warn', message: warn.toString() });
          }
        };

        ${injectdebug}
        ${vars}
        ${(depscode ? depscode : '')}
        ${code}

        console = hal9__console;
        hal9__returns = ${returns}
      } catch(e) {
        hal9__error = e;
      }

      if (hal9__error) {
        return {
          error: hal9__error,
          console: hal9__console
        }
      }
      else {
        return hal9__returns;
      }
    }`;

  return body;
}

export const getFunction = async function(code /*: string */, params /*: params */, header /*: header */) /*: Promise<func> */ {
  const body = await getFunctionBody(code, params, false, header);

  // $FlowFixMe
  return new Function("return " + body)();
}

export const runFunction = async function(code /*: string */, params /*: params */, header /*: header */) /*: void */ {
  const op = await getFunction(code, params, header);

  params['hal9'] = Object.assign(typeof(window) != 'undefined' && window.hal9 ? window.hal9 : {}, params['hal9']);

  // $FlowFixMe
  return op(params);
}
