
export default function(script, params, inputs, deps, context) {
  return  `
const params = { data: data };

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./pyscript/')) fs.mkdirSync('./pyscript/');

const scriptpath = path.resolve('./pyscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

var paramsserial = {};
Object.keys(params).map(e => paramsserial[e] = params[e])

const paramsname = path.resolve(scriptpath, 'params.json');
await writeFileAsync(paramsname, JSON.stringify(paramsserial));

const scriptname = path.resolve(scriptpath, 'code.py');
const outputname = path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`
import json

hal9__params = {}
with open('\${paramsname}') as json_file:
  hal9__params = json.load(json_file)
  
data = hal9__params['data']

${script}

hal9__output = {
  'data': data
}

with open('\${outputname}', 'w') as json_file:
  json.dump(hal9__output, json_file)
\`);

const { stdout, stderr } = await exec('python3 ' + scriptname, { timeout: 5000 } );

const rawoutput = await readFileAsync(outputname)
const output = JSON.parse(rawoutput);

data = output.data
fs.rmSync(scriptpath, { recursive: true });
  `;
}
