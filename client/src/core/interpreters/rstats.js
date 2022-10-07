import { debuggerIf } from '../utils/debug'

const reservedOutput = [];

export default async function(script, header, context) {
  const debugcode = debuggerIf('interpret');

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  // escape script
  script = script.replace(/`/g, '\\\`');

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

params["hal9__scriptpath"] = scriptpath;
params["hal9__context"] = hal9__context;

const paramsname = path.resolve(scriptpath, 'params.json');
await writeFileAsync(paramsname, JSON.stringify(params));

const scriptname = path.resolve(scriptpath, 'code.R');
const outputname = path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`

hal9__params = jsonlite::read_json('\${paramsname}', simplifyVector = TRUE)

hal9__size <- list(
  width = ifelse(is.null(hal9__params$hal9__context$width) || hal9__params$hal9__context$width == 0, 640, hal9__params$hal9__context$width),
  height = ifelse(is.null(hal9__params$hal9__context$height) || hal9__params$hal9__context$height == 0, 480, hal9__params$hal9__context$height)
)

options(device = function() png(file.path(hal9__params$hal9__scriptpath, 'hal9__plot%03d.png'), width = 2 * hal9__size$width, height = 2 * hal9__size$height, res = 326))
  
${paramRDef}

${script}

hal9__output = list(
  ${routputcode}
)

jsonlite::write_json(hal9__output, '\${outputname}', pretty = FALSE)
\`);

var stderr = '';
var output = {};

var forked = new Promise((accept, reject) => {
  const spawned = spawn('Rscript', [ scriptname ], { timeout: 3600000 });

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

await forked;

if (fs.existsSync(outputname)) {
  const rawoutput = await readFileAsync(outputname)
  output = JSON.parse(rawoutput);
}

var fileslist = fs.readdirSync(scriptpath);

function fileToMediaType(name) {
  var ext = name.split('.').pop();
  var extMediaType = {
    'png': 'image/png',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
  };
  return extMediaType[ext] ? extMediaType[ext] : 'text/plain';
}

${jsoutputcode}

var files = {};
var plots = [];
var plot = null;

fileslist.map(e => {
  const media = fileToMediaType(e);
  const dataurl = 'data:' + media + ';base64,' + fs.readFileSync(path.resolve(scriptpath, e), { encoding: 'base64' });
  if (media != 'text/plain') {
    plot = dataurl;
    plots.push(dataurl);
  }
  else
    files[e] = dataurl;
});


fs.rmSync(scriptpath, { recursive: true });
  `;

  return {
    script: interpreted
  } 
}

