
export default function(script, header) {

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];

  const paramsAll = params;
  paramsAll.push(...inputs);

  const paramNodeDef = paramsAll.map(e => `${e}: ${e}`).join(', ');

  const paramRDef = paramsAll.map(e => `${e} = hal9__params['${e}']`).join('\r\n');

  return  `
const params = { ${paramNodeDef} };

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./rscript/')) fs.mkdirSync('./rscript/');

const scriptpath = path.resolve('./rscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

var paramsserial = {};
Object.keys(params).map(e => paramsserial[e] = params[e])

const paramsname = path.resolve(scriptpath, 'params.json');
await writeFileAsync(paramsname, JSON.stringify(paramsserial));

const scriptname = path.resolve(scriptpath, 'code.py');
const outputname = path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`

hal9__params = jsonlite::read_json('\${paramsname}')
  
${paramRDef}

${script}

hal9__output = list(data = data)

jsonlite::write_json(hal9__output, '\${outputname}', pretty = FALSE)
\`);

const { stdout, stderr } = await exec('Rscript ' + scriptname, { timeout: 5000 } );

const rawoutput = await readFileAsync(outputname)
const output = JSON.parse(rawoutput);

data = output.data
fs.rmSync(scriptpath, { recursive: true });
  `;
}

