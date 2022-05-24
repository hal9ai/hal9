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
const portnumber = 8001;

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./rscript/')) fs.mkdirSync('./rscript/');

const scriptpath = path.resolve('./rscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

const plumberscript = path.resolve(scriptpath, 'plumber.R');
const paramsname = path.resolve(scriptpath, 'params.json');

const finalscript = \`
  hal9__params = jsonlite::read_json('\${paramsname}', simplifyVector = TRUE)
  ${paramRDef}

#* Validate health
#* @param msg The message to echo
#* @get /health
function(msg="") {
  list(healthy = 'true')
}

${script}
\`;

if (!fs.existsSync('./hal9__ports/')) fs.mkdirSync('./hal9__ports/');
const scriptmd5 = crypto.createHash('md5').update(finalscript).digest("hex");
const portsfile = './hal9__ports/' + portnumber + '.json';
let portsdata = {};
if (fs.existsSync(portsfile)) {
  try {
  const rawports = fs.readFileSync(portsfile);
  portsdata = JSON.parse(rawports);
  } catch(e) {
    console.log('Error reading ports file: ' + e.toString())
  }
}
else {
  const rawports = JSON.stringify({
    hash: scriptmd5
  });
  fs.writeFileSync(portsfile, rawports);
}

if (portsdata.hash && portsdata.hash != scriptmd5) {
  console.log('The api has changed from ' + portsdata.hash + ' to ' + scriptmd5 + ', redeploying.')
}

await writeFileAsync(plumberscript, finalscript);

params["hal9__scriptpath"] = scriptpath;
params["hal9__context"] = hal9__context;
params["hal9__plumberscript"] = plumberscript;
params["hal9__plumberport"] = portnumber;

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

const apilocalurl = 'http://localhost:' + portnumber;
const isHealthy = async () => {
  try {
    const healthurl = apilocalurl + '/health';

    console.log('Checking health for ' + healthurl)
    const healthresult = await fetch(healthurl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return healthresult.ok;
  }
  catch (error) {
    console.log('Check health failed ' + error.toString())
    return false;
  }
}

var stderr = '';
var output = {};

var forker = (accept, reject) => {
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
}

let forked = undefined;

if (!await isHealthy()) {
  console.log('Forking new API process')
  forked = new Promise(forker);
  // await forked;

  await new Promise(r => setTimeout(r, 1000));
}

if (!await isHealthy()) {
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

if (!apiresult.ok) {
  throw 'Failed to retrieve data from: ' + apilocalurl + '/';
}

const datares = await apiresult.json();


// if (fs.existsSync(outputname)) {
//  const rawoutput = await readFileAsync(outputname)
//  output = JSON.parse(rawoutput);
// }

// ${jsoutputcode}

fs.rmSync(scriptpath, { recursive: true });

return {
  data: datares
}`

  return {
    script: interpreted
  } 
}

