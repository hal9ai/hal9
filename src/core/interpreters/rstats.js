import { debuggerIf } from '../utils/debug'

const reservedOutput = [ 'stdout', 'stderr' ];

export default async function(script, header, context) {
  const debugcode = debuggerIf('interpret');

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  const canThrow = !output.includes('stderr');

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

var stdout = '';
var stderr = '';
var error = null;
var output = {};

var forked = new Promise((accept, reject) => {
  const spawned = spawn('Rscript', [ scriptname ], { timeout: 30000 });

  spawned.stdout.on('data', (data) => {
    stdout = stdout + data;
  });

  spawned.stderr.on('data', (data) => {
    stderr = stderr + data;
  });

  spawned.on('close', (code) => {
    if (code != 0) error = stderr;
    accept()
  });
})

await forked;

if (error && ${canThrow}) {
  throw error;
}

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

