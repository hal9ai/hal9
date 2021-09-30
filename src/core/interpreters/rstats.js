
export default function(script, header, context) {

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
params["hal9__context"] = hal9__context;

const paramsname = path.resolve(scriptpath, 'params.json');
await writeFileAsync(paramsname, JSON.stringify(params));

const scriptname = path.resolve(scriptpath, 'code.R');
const outputname = path.resolve(scriptpath, 'output.json');
await writeFileAsync(scriptname, \`

hal9__params = jsonlite::read_json('\${paramsname}')

hal9__size <- list(
  width = ifelse(is.null(hal9__params$hal9__context$width) || hal9__params$hal9__context$width == 0, 640, hal9__params$hal9__context$width),
  height = ifelse(is.null(hal9__params$hal9__context$height) || hal9__params$hal9__context$height == 0, 480, hal9__params$hal9__context$height)
)

options(device = function() png(file.path(hal9__params$hal9__scriptpath, 'hal9__plot%03d.png'), width = 2 * hal9__size$width, height = 2 * hal9__size$height, res = 326))
  
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
}

