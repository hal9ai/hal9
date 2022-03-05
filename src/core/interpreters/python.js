import { debuggerIf } from '../utils/debug'

export default async function(script, header, context) {
  const debugcode = debuggerIf('interpret');

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  const paramsAll = params;
  paramsAll.push(...inputs);

  const paramNodeDef = paramsAll.map(e => `${e}: ${e}`).join(', ');

  const paramPythonDef = paramsAll.map(e => `${e} = hal9__params['${e}']`).join('\r\n');

  const pyoutputcode = output.map(e => "'" + e + "': " + e).join(',\n');
  const jsoutputcode = output.map(e => "" + e + " = output." + e).join('\n');

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

hal9__params = {}
with open('\${paramsname}') as json_file:
  hal9__params = json.load(json_file)
  
${paramPythonDef}

class Capture(list):
  def __enter__(self):
    import sys
    from io import StringIO 
    self._stdout = sys.stdout
    sys.stdout = self._stringio = StringIO()
    return self
  def __exit__(self, *args):
    import sys
    self.extend(self._stringio.getvalue().splitlines())
    del self._stringio    # free up some memory
    sys.stdout = self._stdout
hal9__log = Capture().__enter__()

${script}

hal9__log.__exit__()
log = hal9__log

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

const { stdout, stderr } = await exec('python3 ' + scriptname, { timeout: 30000 } );

const rawoutput = await readFileAsync(outputname)
const output = JSON.parse(rawoutput);

${jsoutputcode}
fs.rmSync(scriptpath, { recursive: true });
  `;

  return {
    script: interpreted
  }
}
