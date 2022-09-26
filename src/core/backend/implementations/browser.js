
const BrowserImplementation = function(hostopt) {
  var nodes = {};
  var data = {};

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

    this.evaluate = function(fn, args) {
      validateFunction(self.functions[fn], fn, self.uid)
      let flat = [];
      for (let arg of args)
        flat.push(arg.value);
      
      return self.functions[fn].apply(this, flat || []);
    }
  }

  function toFunction(val) {
    if (typeof(val) === 'function') return val;
    else return function() { return val };
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
          'result': node.evaluate(functionName, args)
        });
      }
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
}

export const create = function(hostopt) {
  return new BrowserImplementation(hostopt);
}
