import { debuggerIf } from '../utils/debug'

const reservedOutput = [];

export default async function(script, header, context) {
  const debugcode = debuggerIf('interpret');

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  // escape script
  var script = script.replace(/`/g, '\\\`');

  const paramsAll = params;
  paramsAll.push(...inputs);

  const paramNodeDef = paramsAll.map(e => `${e}: ${e}`).join(', ');

  const paramRDef = paramsAll.map(e => `${e} = hal9__params[['${e}']]`).join('\r\n');
  
  const routputcode = output
    .filter(e => !reservedOutput.includes(e))
    .map(e => e + " = " + e).join(',\n');
  const jsoutputcode = output
    .filter(e => !reservedOutput.includes(e))
    .map(e => "" + e + " = output." + e).join('\n');

  // writeFileAsync unescapes so need to double escape
  script = script.replaceAll('\\', '\\\\');

  const interpreted = `${debugcode}
const params = { ${paramNodeDef} };

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./rscript/')) fs.mkdirSync('./rscript/');

const scriptpath = path.resolve('./rscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

const plumberscript = path.resolve(scriptpath, 'plumber.R');
const paramsname = path.resolve(scriptpath, 'params.json');

await writeFileAsync(plumberscript, \`
  hal9__params = jsonlite::read_json('\${paramsname}', simplifyVector = TRUE)
  ${paramRDef}

#* Validate health
#* @param msg The message to echo
#* @get /health
function(msg="") {
  list(healthy = 'true')
}

${script}
\`);

params["hal9__scriptpath"] = scriptpath;
params["hal9__context"] = hal9__context;
params["hal9__plumberscript"] = plumberscript;
params["hal9__plumberport"] = 8001

await writeFileAsync(paramsname, JSON.stringify(params));

const scriptname = path.resolve(scriptpath, 'code.R');
const outputname = ''; // path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`
hal9__params = jsonlite::read_json('\${paramsname}', simplifyVector = TRUE)
${paramRDef}

library(plumber)
r <- plumb(hal9__params$hal9__plumberscript)
r$run(port = hal9__params$hal9__plumberport)
\`);

var stderr = '';
var output = {};

var forked = new Promise((accept, reject) => {
  const spawned = spawn('Rscript', [ scriptname ], { timeout: 5000 });

  spawned.stdout.on('data', (data) => {
    console.log(data.toString())
  });

  spawned.stderr.on('data', (data) => {
    stderr = stderr + data;
    console.error(data.toString())
  });

  spawned.on('close', (code) => {
  });

  spawned.on('error', (err) => {
    hal9__error = stderr;
    hal9__error = hal9__error + 'Error: ' + err;
    reject(hal9__error)
  });

  spawned.on('exit', (code, signal) => {
    if (code != 0 || signal) {
      hal9__error = stderr;
      if (signal) hal9__error = hal9__error + 'Signal: ' + signal;
      reject(hal9__error)
    }
    else {
      accept()
    }
  });
})

await new Promise(r => setTimeout(r, 1000));

const apilocalurl = 'http://localhost:8001';
const healthresult = await fetch(apilocalurl + '/health', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

if (!healthresult.ok) {
  throw 'Failed to retrieve data from: ' + apilocalurl + '/health';
}

const apiparams = Object.assign(
  {
    hal9: 'hal9'
  }, {
    ${paramNodeDef}
  });

console.log('apiparams: ' + JSON.stringify(apiparams))

const apiresult = await fetch(apilocalurl + '/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(apiparams),
});

if (!healthresult.ok) {
  throw 'Failed to retrieve data from: ' + apilocalurl + '/';
}

const datares = await apiresult.json();

fs.rmSync(scriptpath, { recursive: true });

return {
  data: datares
}`

  return {
    script: interpreted
  } 
}

