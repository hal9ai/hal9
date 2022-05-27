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

  const paramPythonDef = paramsAll.map(e => `${e} = typedeserialize(hal9__params['${e}'])`).join('\r\n');

  const pyoutputcode = output
    .filter(e => !reservedOutput.includes(e))
    .map(e => "'" + e + "': typeserialize(" + e + ")").join(',\n');
  const jsoutputcode = output
    .filter(e => !reservedOutput.includes(e))
    .map(e => "" + e + " = datares." + e).join('\n');

  // writeFileAsync unescapes so need to double escape
  script = script.replaceAll('\\', '\\\\');

  const interpreted = `${debugcode}
const params = { ${paramNodeDef} };
const portnumber = 8002;

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./pyscript/')) fs.mkdirSync('./pyscript/');

const scriptpath = path.resolve('./pyscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

params["hal9__scriptpath"] = scriptpath;
params["hal9__context"] = hal9__context;

var paramsserial = {};
Object.keys(params).map(e => paramsserial[e] = params[e])

const flaskscript = path.resolve(scriptpath, 'hal9api.py');
const paramsname = path.resolve(scriptpath, 'params.json');

const apiscript = \`
${script}

@app.route('/health')
def health():
    return { 'healthy': 'true' }
\`;
const finalscript = apiscript;

if (!fs.existsSync('./hal9__ports/')) fs.mkdirSync('./hal9__ports/');
const scriptmd5 = crypto.createHash('md5').update(apiscript).digest("hex");
const portsfile = './hal9__ports/' + portnumber + '.json';

const updatePortsFile = (hash, pid) => {
  const rawports = JSON.stringify({
    hash: hash,
    pid: pid
  });
  fs.writeFileSync(portsfile, rawports);
}

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
  updatePortsFile(scriptmd5)
}

if (portsdata.hash && portsdata.hash != scriptmd5) {
  console.log(\`The api with pid \${portsdata.pid} has changed from \${portsdata.hash} to \${scriptmd5} redeploying.\`)
  if (portsdata.pid) {
    try {
      await exec('kill -9 ' + portsdata.pid)
      console.log('Killed process ' + portsdata.pid)
    }
    catch(e) {
      console.log('Failed to kill: ' + e.toString())
    }
  }
}

await writeFileAsync(flaskscript, finalscript);

params["hal9__scriptpath"] = scriptpath;
params["hal9__context"] = hal9__context;
params["hal9__apiscript"] = flaskscript;
params["hal9__apiport"] = portnumber;

await writeFileAsync(paramsname, JSON.stringify(params));

const outputname = ''; // path.resolve(scriptpath, 'output.json');

const apilocalurl = 'http://127.0.0.1:' + portnumber;
const isHealthy = async () => {
  try {
    const healthurl = apilocalurl + '/health';
    console.log('Checking health for ' + healthurl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 100)

    const healthresult = await fetch(healthurl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId)

    return healthresult.ok;
  }
  catch (error) {
    console.log('Check health failed ' + error.toString())
    return false;
  }
}

var stderr = '';
var output = {};
hal9__error = undefined;

var forker = (accept, reject) => {
  flaskparams = [ '-m', 'flask', 'run', '-h', 'localhost', '-p', portnumber ]
  console.log('spawning: ' + flaskscript + ' ' + flaskparams.join(' '))
  const spawned = spawn('python3', flaskparams, { env: { 'FLASK_APP': flaskscript } });

  updatePortsFile(scriptmd5, spawned.pid)

  spawned.stdout.on('data', (data) => {
    console.log(data.toString())
  });

  spawned.stderr.on('data', (data) => {
    stderr = stderr + data;
    console.error(data.toString())
  });

  spawned.on('close', (code) => {
    hal9__error = 'API terminated with code ' + code;
  });

  spawned.on('error', (err) => {
    // hal9__error = stderr;
    // hal9__error = hal9__error + 'Error: ' + err;
    // if (reject) reject(hal9__error)
  });

  spawned.on('exit', (code, signal) => {
    if ((code != null && code > 0) || (signal && signal.toString() != 'SIGKILL')) {
      console.log('Process exited with code [' + code + '] and signal [' + signal + ']');
      
      hal9__error = stderr;
      if (signal) hal9__error = hal9__error + 'Signal: [' + signal + ']';
      if (reject) reject(hal9__error)
    }
    else {
      if (accept) accept()
    }
  });
}

let forked = undefined;

if (!await isHealthy()) {
  console.log('Forking new API process')
  forker()

  const maxInitializationTime = 60;
  var initTimeoutSec = maxInitializationTime;
  const forkPromise = new Promise((accept, reject) => {
    const waitInitialized = async () => {
      initTimeoutSec = initTimeoutSec - 1;

      try {
        if (hal9__error) {
          console.log('Error while initializing API: ' + hal9__error)
          reject(hal9__error)
        }
        else if (initTimeoutSec <= 0) {
          console.log('Failed to initialize after ' + maxInitializationTime + ' seconds')
          reject('Failed to initialize after ' + maxInitializationTime + ' seconds')
        }
        else if (!await isHealthy()) {
          console.log('API is not healthy, waiting')
          setTimeout(waitInitialized, 1000);
        }
        else {
          console.log('API is healthy, success!')
          accept()
        }
      }
      catch(e) {
        console.log('API init failed: ' + e.toString())
        reject(e)
      }
    };

    waitInitialized();
  })

  await forkPromise;
  
  // await new Promise(r => setTimeout(r, 1000));
}

const apiparams = Object.assign(
  {
    hal9: 'hal9'
  }, {
    ${paramNodeDef}
  });

console.log('apiparams: ' + Object.keys(apiparams).join(', '))

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

${jsoutputcode}

fs.rmSync(scriptpath, { recursive: true });
  `;

  return {
    script: interpreted
  } 
}

