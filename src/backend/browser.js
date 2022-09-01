
var nodes = {};
var data = {};

let Node = function(uid, values, events) {
  let self = this;

  let validateFunction = function(fn, name, uid) {
    if (!fn)
      throw 'The property "' + name + '" in "' + uid, '" is not defined';
    if (typeof(fn) != 'function')
      throw 'The property "' + name + '" in "' + uid + '" is not a function';
  }

  this.evaluate = function(fn, args) {
    let result = {};
    if (fn) {
      validateFunction(events[fn], fn, self.uid)
      let flat = [];
      for (let argName of Object.keys(args))
        flat.push(args[argName]);
      result[fn] = events[fn].apply(this, flat || []);
    }
    else {
      for (let name of Object.keys(values)) {
        validateFunction(values[name], name, self.uid)
        result[name] = values[name]()
      }
    }

    return result;
  }
}

function toFunction(val) {
  if (typeof(val) === 'function') return val;
  else return function() { return val };
}

export function node(uid, properties) {
  let values = {};
  let events = {};

  for (let property of Object.keys(properties)) {
    if (property.startsWith('on_')) {
      events[property] = properties[property];
    } else {
      values[property] = toFunction(properties[property]);
    }
  }

  nodes[uid] = new Node(uid, values, events);
}

export function set(uid, value) {
  data[uid] = value;
}

export function get(uid) {
  return data[uid];
}

export function process(req) {
  let uids = Object.keys(req);

  let results = {};

  for (let uid of uids) {
    let node = nodes[uid];
    let functions = req[uid];
    let functionNames = Object.keys(functions);

    if (!node) {
      results[uid] = {};
    }
    else if (!Object.keys(functions).length) {
      results[uid] = {
        result: node.evaluate(null, {})
      };
    } else {
      node.evaluate(functionNames[0], functions[functionNames[0]]);
      results[uid] = {};
    }
  }

  return results;
}
