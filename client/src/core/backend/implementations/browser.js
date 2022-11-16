
import { loadScripts } from '../../utils/scriptloader';

const BrowserImplementation = function(hostopt) {
  var nodes = {};
  var data = {};

  var terminalOnData;
  const originalConsole = window.console;

  let Node = function(uid, functions) {
    let self = this;

    self.uid = uid;
    self.functions = functions;

    let validateFunction = function(fn, name, uid) {
      if (!fn)
        throw 'The property "' + name + '" in "' + uid, '" is not defined';
      if (typeof(fn) != 'function')
        throw 'The property "' + name + '" in "' + uid + '" is not a function';
    }

    this.evaluate = async function(fn, args) {
      if (!self.functions[fn]) return undefined;
      if (typeof(self.functions[fn]) !== 'function') return self.functions[fn];

      validateFunction(self.functions[fn], fn, self.uid)
      let flat = [];
      for (let arg of args)
        flat.push(arg.value);
      
      return await self.functions[fn].apply(this, flat || []);
    }
  }

  function toFunction(val) {
    if (typeof(val) === 'function') return val;
    else return function() { return val };
  }

  function overrideConsole() {
    const consoleOverride = function(op, args) {
      args = [...args];
      originalConsole[op].apply(originalConsole, args);
      if (terminalOnData) terminalOnData(args.join(' ') + '\n\r');
    }

    window.console = {
      log: function () { consoleOverride('log', arguments); },
      error: function () { consoleOverride('error', arguments); },
      warn: function() { consoleOverride('warn', arguments); },
    }
  }

  function restoreConsole() {
    window.console = originalConsole;
  }

  this.node = function(uid, properties) {
    let functions = {};

    for (let property of Object.keys(properties)) {
      functions[property] = properties[property];
    }

    nodes[uid] = new Node(uid, functions);
  }

  this.set = function(uid, value) {
    data[uid] = value;
  }

  this.get = function(uid) {
    return data[uid];
  }

  this.process = async function(req) {
    let calls = req.manifests[0].calls;

    let results = [];

    overrideConsole();
    try {
      for (let call of calls) {
        let uid =  call['node'];
        let functionName = call['fn_name'];
        let args = call['args'];
        let node = nodes[uid];
        if (!node) {
          results[uid] = {};
        }
        else {
          results.push({
            'node': uid,
            'fn_name': functionName,
            'result': await node.evaluate(functionName, args)
          });
        }
      }
    }
    finally {
      restoreConsole();
    }

    return {
      responses: [{
        runtime: 'js',
        calls: results
      }]
    };
  }

  this.addRuntime = async function(spec) {
    return spec;
  }

  this.putFile = async function(runtime, path, contents) {
    const fnName = 'nodefn' + Math.floor(Math.random() * 10000000);

    const body = `async function ${fnName}(h9) {

${contents}

}
    `;

    // clear state
    nodes = {};
    data = {};

    const fn = new Function('return ' + body)();

    overrideConsole()
    try {
      await fn({
        node: this.node,
        get: this.get,
        set: this.set,
        require: loadScripts,
      })
    }
    finally {
      restoreConsole();
    }

    return true;
  }

  this.initTerminal = async function(runtime, options) {
    return {
      read: (ondata) => terminalOnData = ondata,
      write: (data) => null,
    }
  }
}

export const create = function(hostopt) {
  return new BrowserImplementation(hostopt);
}
