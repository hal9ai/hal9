import { debuggerIf } from '../utils/debug'
import * as pycore from './pycore'

const reservedOutput = [];

export default async function(script, header, context) {
  const debugcode = debuggerIf('interpret');

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  var pyprecode = pycore.pyprecode(output);
  var pypostcode = pycore.pypostcode(output);

  const paramsAll = params;
  paramsAll.push(...inputs);

  const paramNodeDef = paramsAll.map(e => `${e}: ${e}`).join(', ');

  const paramPythonDef = paramsAll.map(e => `${e} = typedeserialize(hal9__params['${e}'])`).join('\r\n');

  const pyoutputcode = output
    .filter(e => !reservedOutput.includes(e))
    .map(e => "'" + e + "': typeserialize(" + e + ")").join(',\n');
  const jsoutputcode = output
    .filter(e => !reservedOutput.includes(e))
    .map(e => "" + e + " = output." + e).join('\n');

  // writeFileAsync unescapes so need to double escape
  script = script.replaceAll('\\', '\\\\');

  const interpreted = `${debugcode}
const params = { ${paramNodeDef} };

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./pyscript/')) fs.mkdirSync('./pyscript/');

const scriptpath = path.resolve('./pyscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

var paramsserial = {};
Object.keys(params).map(e => paramsserial[e] = params[e])

const paramsname = path.resolve(scriptpath, 'params.json');
await writeFileAsync(paramsname, JSON.stringify(paramsserial));

const scriptname = path.resolve(scriptpath, 'hal9code.py');
const outputname = path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`
import json
import pickle
import base64

hal9__params = {}
with open('\${paramsname}') as json_file:
  hal9__params = json.load(json_file)

def jsonable(x):
  try:
    json.dumps(x)
    return True
  except (TypeError, OverflowError):
    return False

def isDataFrame(x):
  try:
    import pandas as pd
    return isinstance(x, pd.DataFrame)
  except (TypeError, OverflowError):
    return False

def typeserialize(x):
  if not jsonable(x) and not isDataFrame(x):
    return {
      "__type__": "base64",
      "__serializer__": "pickle",
      "__base64__": base64.b64encode(pickle.dumps(x)).decode()
    }
  else:
    return x

def typedeserialize(x):
  if type(x) is dict and "__type__" in x.keys() and x["__type__"] == "base64":
    return pickle.loads(base64.b64decode(x["__base64__"]))
  else:
    return x
  
${paramPythonDef}

${pyprecode}
${script}
${pypostcode}

hal9__output = {
  ${pyoutputcode}
}

with open('\${outputname}', 'w') as json_file:
  json.dump(
    hal9__output,
    json_file,
    default = lambda df: json.loads(df.to_json(orient = 'records'))
  )
\`);

var stderr = '';
var output = {};

var forked = new Promise((accept, reject) => {
  const spawned = spawn('python3', [ scriptname ], { timeout: 30000 });

  spawned.stdout.on('data', console.log);

  spawned.stderr.on('data', (data) => {
    stderr = stderr + data;
    console.error(data)
  });

  spawned.on('close', (code) => {
    if (code != 0) hal9__error = stderr;
    accept()
  });
})

await forked;

if (fs.existsSync(outputname)) {
  const rawoutput = await readFileAsync(outputname)
  output = JSON.parse(rawoutput);
}

${jsoutputcode}
fs.rmSync(scriptpath, { recursive: true });
  `;

  return {
    script: interpreted
  }
}
