
export default function(script, header, context) {

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];

  const paramsAll = params;
  paramsAll.push(...inputs);

  const paramNodeDef = paramsAll.map(e => `${e}: ${e}`).join(', ');

  const paramPythonDef = paramsAll.map(e => `${e} = hal9__params['${e}']`).join('\r\n');

  return  `
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

${script}

hal9__output = {
  'data': data
}

with open('\${outputname}', 'w') as json_file:
  json.dump(hal9__output, json_file)
\`);

const { stdout, stderr } = await exec('python3 ' + scriptname, { timeout: 30000 } );

const rawoutput = await readFileAsync(outputname)
const output = JSON.parse(rawoutput);

data = output.data
fs.rmSync(scriptpath, { recursive: true });
  `;
}
