
export default function(script, header) {

  const params = header.params ? header.params.map(e => e.name) : [];
  const inputs = header.input ? header.input : [];

  // escape script
  script = script.replace(/`/g, '\\\`');

  const paramsAll = params;
  paramsAll.push(...inputs);

  const paramNodeDef = paramsAll.map(e => `${e}: ${e}`).join(', ');

  const paramRDef = paramsAll.map(e => `${e} = hal9__params[['${e}']]`).join('\r\n');

  return  `
const params = { ${paramNodeDef} };

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
if (!fs.existsSync('./rscript/')) fs.mkdirSync('./rscript/');

const scriptpath = path.resolve('./rscript/', Math.random().toString());
if (!fs.existsSync(scriptpath)) fs.mkdirSync(scriptpath);

params["hal9__scriptpath"] = scriptpath;

const paramsname = path.resolve(scriptpath, 'params.json');
await writeFileAsync(paramsname, JSON.stringify(params));

const scriptname = path.resolve(scriptpath, 'code.R');
const outputname = path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`

hal9__params = jsonlite::read_json('\${paramsname}')

options(device = function() png(file.path(hal9__params$hal9__scriptpath, 'hal9__plot%03d.png')))
  
${paramRDef}

${script}

hal9__output = list(data = data)

jsonlite::write_json(hal9__output, '\${outputname}', pretty = FALSE)
\`);

const { stdout, stderr } = await exec('Rscript ' + scriptname, { timeout: 30000 } );

const rawoutput = await readFileAsync(outputname)
const output = JSON.parse(rawoutput);

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

data = output.data;
var files = {};
fileslist.map(e => files[e] = 'data:' + fileToMediaType(e) + ';base64,' + fs.readFileSync(path.resolve(scriptpath, e), { encoding: 'base64' }));

fs.rmSync(scriptpath, { recursive: true });
  `;
}

